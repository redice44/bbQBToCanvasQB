import * as config from 'config';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as Puppeteer from 'puppeteer';

export default async ( questions, downloadDir ) => {

  mkdirp.sync( downloadDir );

  const imageFiles = [];

  const opts = {

    headless: false

  }

  const browser = await Puppeteer.launch( opts );
  const page = await browser.newPage();

  await login( page );

  for ( let questionNum = 0; questionNum < questions.length; questionNum++ ) {

    for ( let imageNum = 0; imageNum < questions[ questionNum ].images.length; imageNum++ ) {

      console.log( `Downloading Question ${ questionNum + 1 } of ${ questions.length }: Image ${ imageNum + 1 } of ${ questions[ questionNum ].images.length }` );

      const fileName = await download( browser, `${ config.get( 'bb.domain' ) }${ questions[ questionNum ].images[ imageNum ] }`, downloadDir, `${ questions[ questionNum ].title }-${ imageNum + 1 }` )
      imageFiles.push( {

        question: questions[ questionNum ].title,
        file: fileName

      } );

    }

  }

  await page.close();
  await browser.close();

  return imageFiles;

}

/*
  Author: @ebidel
  Source: https://github.com/GoogleChrome/puppeteer/issues/299#issuecomment-328295644
  Modified by: @redice44 <Matthew Thomson>
*/

async function download ( browser: Puppeteer.Browser, uri, imageLoc, imageName ) {

  const page = await browser.newPage();
  const responses = [];

  page.on( 'response', resp => {

    responses.push( resp );

  } );

  page.on( 'load', () => {

    responses.map( async ( resp, i ) => {

      const request = await resp.request();
      const url = request.url();
      const urlSplit = url.split( '/' );
      const fileName = urlSplit[ urlSplit.length - 1];
      const fileSplit = fileName.split( '.' );
      const ext = fileSplit[ fileSplit.length - 1 ];
      const buffer = await resp.buffer();
      fs.writeFileSync( `${ imageLoc }/${ imageName }.${ ext }`, buffer );

    } );

  } );

  await page.goto( uri, { waitUntil: 'networkidle0' } );
  const urlSplit = ( await page.url() ).split( '/' );
  const fileSplit = urlSplit[ urlSplit.length - 1 ].split( '.' );
  const ext = fileSplit[ fileSplit.length - 1 ];
  await page.close();

  return `${ imageLoc }/${ imageName }.${ ext }`;

}

async function login( page: Puppeteer.Page ) {

  await page.goto( config.get( 'bb.login' ) );
  await page.click( '#username' );
  await page.keyboard.type( config.get( 'bb.user.name' ) );
  await page.click( '#password' );
  await page.keyboard.type( config.get( 'bb.user.pw' ) );
  await page.click( '#fm1 > div.row.btn-row > input.btn-submit' );
  await page.waitForNavigation();
  // await page.waitFor( 2000 );

}
