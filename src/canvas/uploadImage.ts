import * as config from 'config';
import * as fs from 'fs';
import * as request from 'request-promise-native';

export default async ( courseId, parentFolderId, file ) => {

  const fileSplit = file.split( '/' );
  const setupRes = await setupFile( courseId, parentFolderId, fileSplit[ fileSplit.length - 1 ] );
  const uploadRes = await uploadFile( courseId, file, setupRes );

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

async function uploadFile ( courseId, file, res ) {

  const opts = {

    method: 'POST',
    uri: `${ res.upload_url }`,
    formData: Object.assign( {}, res.upload_params, {

      file: fs.createReadStream( file )


    } ),
    simple: false,
    resolveWithFullResponse: true

  };

  return request( opts )

}

async function setupFile ( courseId, parentFolderId, fileName ) {

  const opts = {

    method: 'POST',
    uri: `${ config.get( 'canvas.domain' ) }api/v1/courses/${ courseId }/files`,
    headers: {

      'Authorization': `Bearer ${ config.get( 'canvas.token' ) }`

    },
    form: {

      name: fileName,
      parent_folder_id: parentFolderId

    },

    json: true
  }

  return request( opts );

}
