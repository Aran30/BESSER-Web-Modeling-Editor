import React, { Component, ComponentClass, createRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { Button } from '../../../components/controls/button/button';
import { ColorButton } from '../../../components/controls/color-button/color-button';
import { Divider } from '../../../components/controls/divider/divider';
import { TrashIcon } from '../../../components/controls/icon/trash';
import { Textfield } from '../../../components/controls/textfield/textfield';
import { Header } from '../../../components/controls/typography/typography';
import { I18nContext } from '../../../components/i18n/i18n-context';
import { localized } from '../../../components/i18n/localized';
import { ModelState } from '../../../components/store/model-state';
import { StylePane } from '../../../components/style-pane/style-pane';
import { UMLElement } from '../../../services/uml-element/uml-element';
import { UMLElementRepository } from '../../../services/uml-element/uml-element-repository';
import { AsyncDispatch } from '../../../utils/actions/actions';
import { notEmpty } from '../../../utils/not-empty';
import { AgentElementType } from '..';
import { BotStateBody } from '../bot-state-body/bot-state-body';
import { BotStateFallbackBody } from '../bot-state-fallback-body/bot-state-fallback-body';
import { UMLElementType } from '../../uml-element-type';
import { UMLElements } from '../../uml-elements';
import { BotState } from './bot-state';
import BotBodyUpdate from '../bot-state-body/bot-state-body-update';
import { BotStateMember } from '../bot-state/bot-state-member';

const Flex = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const StyledTextArea = styled.textarea`
  padding: 8px;
  border: 1px solid ${(props) => props.theme.color.gray};
  border-radius: 4px;
  width: 100%;
  max-width: 100%;
  min-height: 150px;
  font-family: monospace;
  resize: vertical;
  white-space: pre;
  tab-size: 4;
  box-sizing: border-box;
  overflow-x: auto;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.color.primary};
  }
`;


interface OwnProps {
  element: BotState;
}

type StateProps = {};

interface DispatchProps {
  create: typeof UMLElementRepository.create;
  update: typeof UMLElementRepository.update;
  remove: typeof UMLElementRepository.delete; // Renamed to avoid conflict with reserved keywords
  getById: (id: string) => UMLElement | null;
}

type Props = OwnProps & StateProps & DispatchProps & I18nContext;

interface State {
  colorOpen: boolean;
  fieldToFocus?: Textfield<string> | null;
}

const getInitialState = (): State => ({
  colorOpen: false,
});

const enhance = compose<ComponentClass<OwnProps>>(
  localized,
  connect<StateProps, DispatchProps, OwnProps, ModelState>(null, {
    create: UMLElementRepository.create,
    update: UMLElementRepository.update,
    remove: UMLElementRepository.delete, // Updated to match the renamed property
    getById: UMLElementRepository.getById as any as AsyncDispatch<typeof UMLElementRepository.getById>,
  }),
);

class StateUpdate extends Component<Props, State> {
  state = getInitialState();
  newFallbackBodyField = createRef<Textfield<string>>();
  newBodyField = createRef<Textfield<string>>();
  private actionTypeRef = createRef<HTMLInputElement>();
  textReplyRefBody = true;
  textReplyRefFallbackBody = true;
  private toggleColor = () => {
    this.setState((state) => ({
      colorOpen: !state.colorOpen,
    }));
  };

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.state.fieldToFocus) {
      this.state.fieldToFocus.focus();
      this.setState({ fieldToFocus: undefined });
    }
  }


  private handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow tab key to insert a tab character instead of changing focus
    if (event.key === 'Tab') {
      event.preventDefault();

      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const value = target.value;
      const newValue = value.substring(0, start) + '\t' + value.substring(end);

      // Update the value directly
      target.value = newValue;

      // Update the cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);


    }
  };


  render() {
    const { element, getById } = this.props;
    const children = element.ownedElements.map((id) => getById(id)).filter(notEmpty);
    const bodies = children.filter(
      (child): child is BotStateMember => child instanceof BotStateBody
    );
    const fallbackBodies = children.filter(
      (child): child is BotStateMember => child instanceof BotStateFallbackBody
    );
    const bodyRefs: (Textfield<string> | null)[] = [];
    const fallbackBodyRefs: (Textfield<string> | null)[] = [];

    return (
      <div>
        <section>
          <Flex>
            <Textfield value={element.name} onChange={this.rename(element.id)} autoFocus />
            <ColorButton onClick={this.toggleColor} />
            <Button color="link" tabIndex={-1} onClick={this.delete(element.id)}>
              <TrashIcon />
            </Button>
          </Flex>
          <StylePane
            open={this.state.colorOpen}
            element={element}
            onColorChange={this.props.update}
            fillColor
            lineColor
            textColor
          />
          <Divider />
        </section>
        <section>
          Bot Action
          <div>
            <label>
              <input
                type="radio"
                name="actionType"
                value="textReply"
                defaultChecked
                onChange={() => {
                  this.textReplyRefBody = true
                  this.forceUpdate()
                }}
              />
              Text Reply
            </label>
            <label>
              <input
                type="radio"
                name="actionType"
                value="pythonCode"
                onChange={() => {
                  this.textReplyRefBody = false
                  this.forceUpdate()
                }}
              />
              Python Code
            </label>
          </div>

          {/* Conditionally render based on the selected radio button */}
          {this.textReplyRefBody ? (
            <>
              {bodies
                .filter((body) => body.replyType === "text")
                .map((body, index) => (
                  <BotBodyUpdate
                    id={body.id}
                    key={body.id}
                    value={body.name}
                    onChange={this.props.update}
                    onSubmitKeyUp={() =>
                      index === bodies.length - 1
                        ? this.newBodyField.current?.focus()
                        : this.setState({
                          fieldToFocus: bodyRefs[index + 1],
                        })
                    }
                    onDelete={this.delete}
                    onRefChange={(ref) => (bodyRefs[index] = ref)}
                    element={body}
                  />
                ))}
              <Textfield
                ref={this.newBodyField}
                outline
                value=""
                onSubmit={this.create(BotStateBody, "text")}
                onSubmitKeyUp={(key: string, value: string) => {
                  if (value) {
                    this.setState({
                      fieldToFocus: this.newBodyField.current,
                    });
                  } else {
                    if (fallbackBodyRefs && fallbackBodyRefs.length > 0) {
                      this.setState({
                        fieldToFocus: fallbackBodyRefs[0],
                      });
                    } else {
                      this.setState({
                        fieldToFocus: this.newFallbackBodyField.current,
                      });
                    }
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Tab' && event.currentTarget.value) {
                    event.preventDefault();
                    event.currentTarget.blur();
                    this.setState({
                      fieldToFocus: this.newBodyField.current,
                    });
                  }
                }}
              />
            </>
          ) : (
            <>
              {bodies.some((body) => body.replyType === "code") ? (
              <StyledTextArea
                value={bodies.find((body) => body.replyType === "code")!.name}
                placeholder="Enter your Python code here..."
                onChange={(event) => {
                const body = bodies.find((body) => body.replyType === "code")!;
                const value = event.target.value;
                if (value.trim()) {
                  this.props.update(body.id, { name: value });
                } else {
                  this.props.remove(body.id); // Updated to use the renamed method
                }
                }}
                onKeyDown={this.handleKeyDown}
                autoFocus
                spellCheck={false}
              />
              ) : (
              <StyledTextArea
                placeholder="Enter your Python code here..."
                onChange={(event) => {
                const value = event.target.value;
                if (value.trim()) {
                  this.create(BotStateBody, "code")(value);
                }
                }}
                onKeyDown={this.handleKeyDown}
                autoFocus
                spellCheck={false}
              />
              )}
            </>

          )}
        </section>
        <section>
          <Divider />
          <Header>{this.props.translate('popup.fallback_bodies')}</Header>
          <Flex>
            <Textfield value={element.name} onChange={this.rename(element.id)} autoFocus />
            <ColorButton onClick={this.toggleColor} />
            <Button color="link" tabIndex={-1} onClick={this.delete(element.id)}>
              <TrashIcon />
            </Button>
          </Flex>
          <StylePane
            open={this.state.colorOpen}
            element={element}
            onColorChange={this.props.update}
            fillColor
            lineColor
            textColor
          />
          <Divider />
        </section>
        <section>
          Bot Fallback Action
          <div>
            <label>
              <input
                type="radio"
                name="fallbackActionType"
                value="textReply"
                defaultChecked
                onChange={() => {
                  this.textReplyRefFallbackBody = true
                  this.forceUpdate()
                }}
              />
              Text Reply
            </label>
            <label>
              <input
                type="radio"
                name="fallbackActionType"
                value="pythonCode"
                onChange={() => {
                  this.textReplyRefFallbackBody = false
                  this.forceUpdate()
                }}
              />
              Python Code
            </label>
          </div>

          {/* Conditionally render based on the selected radio button */}
          {this.textReplyRefFallbackBody ? (
            <>
              {fallbackBodies
                .filter((fallbackBody) => fallbackBody.replyType === "text")
                .map((fallbackBody, index) => (
                  <BotBodyUpdate
                    id={fallbackBody.id}
                    key={fallbackBody.id}
                    value={fallbackBody.name}
                    onChange={this.props.update}
                    onSubmitKeyUp={() =>
                      index === fallbackBodies.length - 1
                        ? this.newFallbackBodyField.current?.focus()
                        : this.setState({
                          fieldToFocus: fallbackBodyRefs[index + 1],
                        })
                    }
                    onDelete={this.delete}
                    onRefChange={(ref) => (fallbackBodyRefs[index] = ref)}
                    element={fallbackBody}
                  />
                ))}
              <Textfield
                ref={this.newFallbackBodyField}
                outline
                value=""
                onSubmit={this.create(BotStateFallbackBody, "text")}
                onSubmitKeyUp={() =>
                  this.setState({
                    fieldToFocus: this.newFallbackBodyField.current,
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === 'Tab' && event.currentTarget.value) {
                    event.preventDefault();
                    event.currentTarget.blur();
                    this.setState({
                      fieldToFocus: this.newFallbackBodyField.current,
                    });
                  }
                }}
              />
            </>
          ) : (
            <>
              {fallbackBodies.some((fallbackBody) => fallbackBody.replyType === "code") ? (
              <StyledTextArea
                value={fallbackBodies.find((fallbackBody) => fallbackBody.replyType === "code")!.name}
                placeholder="Enter your Python code here..."
                onChange={(event) => {
                const fallbackBody = fallbackBodies.find((fallbackBody) => fallbackBody.replyType === "code")!;
                const value = event.target.value;
                if (value.trim()) {
                  this.props.update(fallbackBody.id, { name: value });
                } else {
                  this.props.remove(fallbackBody.id); // Updated to use the renamed method
                }
                }}
                onKeyDown={this.handleKeyDown}
                autoFocus
                spellCheck={false}
              />
              ) : (
              <StyledTextArea
                placeholder="Enter your Python code here..."
                onChange={(event) => {
                const value = event.target.value;
                if (value.trim()) {
                  this.create(BotStateBody, "code")(value);
                }
                }}
                onKeyDown={this.handleKeyDown}
                autoFocus
                spellCheck={false}
              />
              )}
            </>

          )}
        
        </section>
      </div>
    );
  }

  private create = (Clazz: typeof BotStateBody | typeof BotStateFallbackBody, replyType: string) => (value: string) => {
    const { element, create } = this.props;
    const member = new Clazz();
    member.name = value;
    member.replyType = replyType
    create(member, element.id);
  };

  private rename = (id: string) => (value: string) => {
    this.props.update(id, { name: value });
  };

  private delete = (id: string) => () => {
    this.props.remove(id); // Updated to use the renamed method
  };
}

export const BotStateUpdate = enhance(StateUpdate);