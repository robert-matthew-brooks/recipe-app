import { createContext, useState } from 'react';
import TextBtn from '../TextBtn';
import './Prompt.css';

export const PromptContext = createContext({});

export function PromptContextProvider({ children }) {
  const [message, setMessage] = useState('');
  const [positiveText, setPositiveText] = useState('');
  const [positiveStyle, setPositiveStyle] = useState(null);
  const [negativeText, setNegativeText] = useState('');
  const [negativeStyle, setNegativeStyle] = useState(null);
  const [callback, setCallback] = useState(() => () => {});

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createPrompt = ({
    message,
    positiveText,
    positiveStyle,
    negativeText,
    negativeStyle,
    cb,
  }) => {
    setMessage(message);
    setPositiveText(positiveText);
    setPositiveStyle(positiveStyle);
    setNegativeText(negativeText);
    setNegativeStyle(negativeStyle);
    setCallback(() => async () => {
      setIsLoading(true);
      await cb();
      setIsLoading(false);
      hidePrompt();
    });

    showPrompt();
  };

  const showPrompt = () => {
    setIsVisible(true);
    document.body.classList.add('noscroll');
  };

  const hidePrompt = () => {
    setIsVisible(false);
    document.body.classList.remove('noscroll');
  };

  return (
    <PromptContext.Provider
      value={{
        createPrompt,
      }}
    >
      <div id="Prompt" className={!isVisible ? 'Prompt--hidden' : undefined}>
        <div id="Prompt__inner">
          <p id="Prompt__message">{message}</p>

          <div id="Prompt__button-row">
            <TextBtn
              text={negativeText}
              style={negativeStyle}
              size="2.5"
              callback={hidePrompt}
            />
            <TextBtn
              text={positiveText}
              style={positiveStyle}
              size="2.5"
              callback={callback}
            />
          </div>
        </div>
      </div>
      {children}
    </PromptContext.Provider>
  );
}
