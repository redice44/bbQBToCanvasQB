import { parseString } from 'xml2js';

export default async ( data: string ) =>

  new Promise( ( resolve, reject ) => {

    parseString( data, ( err, json ) =>

      err ? reject( err ) : resolve( json )

    );

  } );
