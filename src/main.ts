import formatXMLQuestions from './bb/formatXMLQuestions';
import extractImage from './util/extractImageSrc';
import downloadImages from './bb/downloadImages';
import uploadImages from './canvas/uploadImage';
import canvasMkdirp from './canvas/mkdirp';
import updateImage from './util/updateImageSrc';
import createQuestionBank from './canvas/createQuestionBank';
import formatCanvasQuestion from './canvas/formatQuestion';

import getArgv from './util/getArgv';
import readFile from './util/readFile';
import writeFile from './util/writeFile';
import xmlToJson from './util/xmlToJson';

main()

async function main() {

  const courseId = 335;

  const opts = parseArgs();
  const config = JSON.parse( await readFile( opts.configFile ) );
  const questions = formatXMLQuestions( await xmlToJson( await readFile( config.inputFile ) ) );

  questions.forEach( question => {

    question.images = extractImage( question );

  } );

  const imageFiles = await downloadImages( questions, config.downloadFolder );
  const folder = await canvasMkdirp( courseId, config.uploadFolder );
  const canvasImages = [];

  for ( let i = 0; i < imageFiles.length; i++ ) {

    console.log( `Uploading Image ${ i + 1 } of ${ imageFiles.length }` );

    canvasImages.push( await uploadImages( courseId, folder.id, imageFiles[ i ].file ) );

  }

  for ( let imageNum = 0; imageNum < imageFiles.length; imageNum++ ) {

    for ( let questionNum = 0; questionNum < questions.length; questionNum++ ) {

      if ( imageFiles[ imageNum ].question === questions[ questionNum ].title ) {

        questions[ questionNum ].html = updateImage( questions[ questionNum ], `courses/${ courseId }/files/${ canvasImages[ imageNum ].id }/download` );

      }

    }

  }

  await createQuestionBank( courseId, config.questionBankTitle, questions.map( formatCanvasQuestion ) );
  await writeFile( config.outputFile, JSON.stringify( questions.map( formatCanvasQuestion ) ) );

}

function parseArgs() {

  const argv = getArgv();
  const opts = {

    configFile: '',
    inFile: '',
    outFile: ''

  };

  while ( argv.length > 0 ) {

    const arg = argv.shift();

    if ( arg[ 0 ] !== '-' ) {

      throw new Error( `Expected flag, but found ${ arg }.` );

    }

    switch ( arg.substr( 1 ) ) {

      case 'c':
      case '-config':
        opts.configFile = argv.shift();
        break;

      default:
        throw new Error( `Unexpected flag: ${ arg.substr( 1 ) }` );

    }

  }

  return opts;

}