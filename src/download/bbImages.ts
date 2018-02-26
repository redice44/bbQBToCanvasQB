import * as config from 'config';
import * as fs from 'fs';
import * as Puppeteer from 'puppeteer';
// import { URL } from 'url';


export default async questions => {

  const imageFiles = [];

  const opts = {

    headless: false

  }

  const browser = await Puppeteer.launch( opts );
  const page = await browser.newPage();

  await login( page );

  for ( let questionNum = 0; questionNum < questions.length; questionNum++ ) {

    for ( let imageNum = 0; imageNum < questions[ questionNum ].images.length; imageNum++ ) {

      const fileName = await download( browser, `${ config.get( 'LMS.bb' ) }${ questions[ questionNum ].images[ imageNum ] }`, `${ questions[ questionNum ].title }-${ imageNum + 1 }` )
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

async function download ( browser: Puppeteer.Browser, uri, imageName ) {

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
      fs.writeFileSync( `${ imageName }.${ ext }`, buffer );

    } );

  })

  await page.goto( uri, { waitUntil: 'networkidle0' } );
  const urlSplit = ( await page.url() ).split( '/' );
  const fileSplit = urlSplit[ urlSplit.length - 1 ].split( '.' );
  const ext = fileSplit[ fileSplit.length - 1 ];
  await page.close();

  return `${ imageName }.${ ext }`;

}

async function login( page: Puppeteer.Page ) {

  await page.goto( config.get( 'LMS.bbLogin' ) );
  await page.click( '#username' );
  await page.keyboard.type( config.get( 'user.name' ) );
  await page.click( '#password' );
  await page.keyboard.type( config.get( 'user.pw' ) );
  await page.click( '#fm1 > div.row.btn-row > input.btn-submit' );
  await page.waitForNavigation();
  // await page.waitFor( 2000 );

}
