import * as config from 'config';
import * as request from 'request-promise-native';

export default async ( courseId: string|number, folder: string ) => {

  try {

    const res = await doesFolderExist( courseId, folder );

    if ( res.statusCode >= 200 && res.statusCode < 300 ) {

      return res.body[ res.body.length - 1 ];

    }

    if ( res.statusCode >= 400 && res.statusCode < 500 ) {

      return await createFolder( courseId, folder );

    }

    throw Error( res );

  } catch ( e ) {

    console.error( e );

  }

}

async function doesFolderExist( courseId: string|number, folder: string ) {

  const opts = {

    method: 'GET',
    uri: `${ config.get( 'canvas.domain' ) }api/v1/courses/${ courseId }/folders/by_path/${ folder }`,
    headers: {

      'Authorization': `Bearer ${ config.get( 'canvas.token' ) }`

    },
    json: true,
    simple: false,
    resolveWithFullResponse: true

  }

  return request( opts )

}

async function createFolder( courseId: string|number, folder: string ) {

  const folderSplit = folder.split( '/' );
  const opts = {

    method: 'POST',
    uri: `${ config.get( 'canvas.domain' ) }api/v1/courses/${ courseId }/folders`,
    headers: {

      'Authorization': `Bearer ${ config.get( 'canvas.token' ) }`

    },
    form: {

      name: folderSplit[ folderSplit.length - 1 ],
      parent_folder_path: folderSplit.slice( 0, folderSplit.length - 1 ).join( '/' )

    },
    json: true

  }

  return request( opts );

}