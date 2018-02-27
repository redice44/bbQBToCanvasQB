import * as jsdom from 'jsdom';

export default ( question, newSrc ) => {

  const dom = jsdom.JSDOM.fragment( question.html );
  const imgs = dom.querySelectorAll( 'img' );
  const imgUrls = [];

  for ( let i = 0; i < imgs.length; i++ ) {

    // imgUrls.push( imgs[ i ].setAttribute( 'src', newSrc ) );
    imgs[ i ].setAttribute( 'src', newSrc );

  }

  console.log( dom.firstChild.outerHTML );

  return dom.firstChild.outerHTML;

};
