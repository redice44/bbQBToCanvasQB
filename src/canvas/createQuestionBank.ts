import * as CanvasPuppet from 'canvas-puppet';
import * as config from 'config';
import * as Puppeteer from 'puppeteer';

export default async ( courseId, questionBankTitle, questions ) {

  const browser = await Puppeteer.launch( {

    headless: false

  } );
  const page = await browser.newPage();

  await CanvasPuppet.admin.login( page, config.get( 'canvas.loginInfo' ) );

  const rootUrl = config.get( 'canvas.domain' );

  const course = {

    id: courseId

  };

  const questionBank = {

    title: questionBankTitle

  };

  await CanvasPuppet.questionBank.create( page, rootUrl, course, questionBank );
  const questionBankList = await CanvasPuppet.questionBank.list( page, rootUrl, course );
  const qBank = questionBankList.filter( qb => qb.title === questionBank.title )[ 0 ];


  for ( let i = 0; i < questions.length; i++ ) {

    await CanvasPuppet.question.create( page, rootUrl, course, qBank, questions[ i ] );

  }

  await page.close();
  await browser.close();

}
