export default questions => separateQuestions( questions ).map( buildQuestion );

const separateQuestions = data => data.questestinterop.assessment[ 0 ].section[ 0 ].item;

const buildQuestion = ( data, i ) => {

  const question = {

    title: `Question ${ '0'.repeat( 4 - ( '' + ( i + 1 ) ).length )}${ i + 1 }`,
    type: data.itemmetadata[ 0 ].bbmd_questiontype[ 0 ],
    html: data.presentation[ 0 ].flow[ 0 ].flow[ 0 ].flow[ 0 ].material[ 0 ].mat_extension[ 0 ].mat_formattedtext[ 0 ]._,
    answers: []

  };

  switch ( question.type ) {

    case 'Multiple Choice':

      question.answers = multipleChoiceAnswers( data );
      break;

    case 'True/False':

      question.answers = trueFalseAnswers( data );
      break;

    default:
      throw new Error( `Unhandled question type: ${ question.type }` );

  }

  return question;

};

const multipleChoiceAnswers = data => {

  const answers = data.presentation[ 0 ].flow[ 0 ].flow[ 1 ].response_lid[ 0 ].render_choice[ 0 ].flow_label.map( answer => {

    return {

      id: answer.response_label[ 0 ].$.ident,
      html: answer.response_label[ 0 ].flow_mat[ 0 ].material[ 0 ].mat_extension[ 0 ].mat_formattedtext[ 0 ]._,
      correct: false

    }

  } );

  answers.forEach( ans => {

    if ( ans.id === data.resprocessing[ 0 ].respcondition[ 0 ].conditionvar[ 0 ].varequal[ 0 ]._ ) {

      ans.correct = true;

    }

  } );

  return answers;

};

const trueFalseAnswers = data => {

  return [ 'True', 'False' ].map( answer => {

    return {

      html: answer,
      correct: data.resprocessing[ 0 ].respcondition[ 0 ].conditionvar[ 0 ].varequal[ 0 ]._ === answer.toLowerCase()

    }

  } );

};
