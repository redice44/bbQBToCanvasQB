import * as fs from 'fs';

export default async ( fileName: string, data: any, opts = {} ) =>

  new Promise ( ( resolve, reject ) => {

    fs.writeFile( fileName, data, opts, err => {

      err ? reject( err ) : resolve( true );

    } );

  } );
