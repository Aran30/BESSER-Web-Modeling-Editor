import datetime
from besser.BUML.metamodel.state_machine.state_machine import StateMachine, Session, Body, Event

sm = StateMachine(name='Generated_State_Machine')

def chronometer_finished(session: Session, event_params: dict):
    # Python code here
    # Return Boolean value
    # Session can be read/written
    seconds = event_params['seconds']
    last_light_change_timestamp = session.get('last_light_change_timestamp')
    current_timestamp = datetime.datetime.now()
    if current_timestamp > (last_light_change_timestamp + seconds):
        return True
    return False

chronometer_finished = Event(name='chronometer_finished', callable=chronometer_finished)

def light_body(session: Session):
    # Python code here
    session.set('last_light_change_timestamp', datetime.datetime.now())
    # Example actions with the session
    # session.set('x', 555)
    # x = session.get('x')
    # session.delete('x')
    # Write anything else...
    # The return is ignored

light_body = Body(name='light_body', callable=light_body)

def fallback_body(session: Session):
    # Python code here
    print('Something went wrong')
    # The return is ignored

fallback_body = Body(name='fallback_body', callable=fallback_body)

Red_state = sm.new_state(name='Red', initial=True)
Green_state = sm.new_state(name='Green', initial=False)
Amber_state = sm.new_state(name='Amber', initial=False)

Red_state.set_body(body=light_body)
Red_state.set_fallback_body(fallback_body)
Green_state.set_body(body=light_body)
Green_state.set_fallback_body(fallback_body)
Amber_state.set_body(body=light_body)
Amber_state.set_fallback_body(fallback_body)

Red_state.when_event_go_to(
    event=chronometer_finished,
    dest=Green_state,
    event_params={ {60} }
)
Green_state.when_event_go_to(
    event=chronometer_finished,
    dest=Amber_state,
    event_params={ {20} }
)
Amber_state.when_event_go_to(
    event=chronometer_finished,
    dest=Red_state,
    event_params={ {3} }
)