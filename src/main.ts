import formatXMLQuestions from './bb/formatXMLQuestions';
import extractImage from './util/extractImageSrc';
import downloadImages from './bb/downloadImages';
import uploadImages from './canvas/uploadImage';
import canvasMkdirp from './canvas/mkdirp';


import getArgv from './util/getArgv';
import readFile from './util/readFile';
import writeFile from './util/writeFile';
import xmlToJson from './util/xmlToJson';

main()

async function main() {

  const opts = parseArgs();
  const quizFolderSplit = opts.inFile.split( '/' ).filter( d => d !== '.' );
  const quizFolder = quizFolderSplit.slice( 0 , quizFolderSplit.length - 1 ).join( '/' );
  const data = await xmlToJson( await readFile( opts.inFile ) );
  const questions = formatXMLQuestions( data );

  questions.forEach( question => {

    question.images = extractImage( question );

  } );

  const imageFiles = await downloadImages( questions, quizFolder );
  const folder = await canvasMkdirp( 335, quizFolder );
  const canvasImages = []

  for ( let i = 0; i < imageFiles.length; i++ ) {

    canvasImages.push ( await uploadImages( 335, folder.id, imageFiles[ i ].file ) );

  }

  // console.log( await canvasMkdirp( 335, 'Quiz Images/Quiz 2' ) );

  await writeFile( opts.outFile, JSON.stringify( canvasImages ) );

}

function parseArgs() {

  const argv = getArgv();
  const opts = {

    inFile: '',
    outFile: ''

  };

  while ( argv.length > 0 ) {

    const arg = argv.shift();

    if ( arg[ 0 ] !== '-' ) {

      throw new Error( `Expected flag, but found ${ arg }.` );

    }

    switch ( arg.substr( 1 ) ) {

      case 'f':
      case 'i':
      case '-file':
      case '-input':
        opts.inFile = argv.shift();
        break;

      case 'o':
      case '-output':
        opts.outFile = argv.shift();
        break;

      default:
        throw new Error( `Unexpected flag: ${ arg.substr( 1 ) }` );

    }

  }

  return opts;

}