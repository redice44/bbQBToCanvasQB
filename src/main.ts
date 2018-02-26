import formatQuestions from './format/bbQuestions';

import getArgv from './util/getArgv';
import readFile from './util/readFile';
import writeFile from './util/writeFile';
import xmlToJson from './util/xmlToJson';

main()

async function main() {

  const opts = parseArgs();
  const data = await xmlToJson( await readFile( opts.inFile ) );
  const questions = formatQuestions( data );
  await writeFile( opts.outFile, JSON.stringify( questions ) );

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