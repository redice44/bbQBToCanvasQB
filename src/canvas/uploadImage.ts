import * as config from 'config';
import * as fs from 'fs';
import * as request from 'request-promise-native';

export default async ( courseId, fileName ) => {

  const setupRes = await setupFile( courseId, fileName );
  const uploadRes = await uploadFile( courseId, fileName, setupRes );

  if ( uploadRes.statusCode >= 300 && uploadRes.statusCode < 400 ) {

    return await finalize( uploadRes.headers.location );

  }

  return uploadRes;

}

async function finalize ( uri ) {

  const opts = {

    method: 'POST',
    uri: uri,
    headers: {

      'Authorization': `Bearer ${ config.get( 'canvas.token' ) }`

    },
    json: true

  }

  return request( opts );

}

async function uploadFile ( courseId, fileName, res ) {

  const opts = {

    method: 'POST',
    uri: `${ res.upload_url }`,
    formData: Object.assign( {}, res.upload_params, {

      file: fs.createReadStream( fileName )


    } ),
    simple: false,
    resolveWithFullResponse: true

  };

  return request( opts )

}

async function setupFile ( courseId, fileName ) {

  const opts = {

    method: 'POST',
    uri: `${ config.get( 'LMS.canvas' ) }api/v1/courses/${ courseId }/files`,
    headers: {

      'Authorization': `Bearer ${ config.get( 'canvas.token' ) }`

    },
    form: {

      name: fileName

    },

    json: true
  }

  return request( opts );

}
