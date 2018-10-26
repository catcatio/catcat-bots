import dialogflow from './dialogflow'
import registerConfirmation from './registerConfirmation'
import linepayconfirm from './linepayconfirm';
import linelogin from './linelogin';

export default (unicorn) => {
  return {
    dialogflow: dialogflow(unicorn),
    linepayconfirm: linepayconfirm(unicorn),
    linelogin: linelogin(unicorn),
    registerConfirmation: registerConfirmation(unicorn)
  }
}
