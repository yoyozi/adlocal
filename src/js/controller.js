import * as model from './model.js';
import personalView from './views/personalView.js';

const init = function () {

    //console.log(form);
    personalView.render(model.state.personal)

   
}

init();