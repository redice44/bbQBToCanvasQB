import * as jsdom from 'jsdom';

export default question => {

  const canvasQuestion = {

    type: '',
    title: question.title,
    text: question.html,
    answers: question.answers.map( ans => {

      const dom = jsdom.JSDOM.fragment( `<div>${ ans.html }</div>` );
      return {

        text: dom.textContent,
        correct: ans.correct

      }

    } )

  };

  switch ( question.type ) {

    case 'Multiple Choice':

      canvasQuestion.type = 'multiple_choice_question';
      break;

    case 'True/False':

      canvasQuestion.type = 'true_false_question';
      break;

  }

  return canvasQuestion;

}
