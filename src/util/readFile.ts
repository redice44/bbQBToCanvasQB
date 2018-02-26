import * as fs from 'fs';

export default async ( fileName: string, opts = {} ): Promise < any > =>

  new Promise ( ( resolve, reject ) => {

    fs.readFile( fileName, opts, ( err, data ) => {

      err ? reject( err ) : resolve( data );

    } );

  } );
