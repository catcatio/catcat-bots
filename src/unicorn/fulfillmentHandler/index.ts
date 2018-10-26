import dialogflow from './dialogflow'
import registerConfirmation from './registerConfirmation'
import linepayconfirm from './linepayconfirm';
import linelogin from './linelogin';
import approveRegistration from './approveRegistration';

export default (unicorn) => {
  return {
    dialogflow: dialogflow(unicorn),
    linepayconfirm: linepayconfirm(unicorn),
    linelogin: linelogin(unicorn),
    registerConfirmation: registerConfirmation(unicorn),
    approveRegistration: approveRegistration(unicorn)
  }
}
