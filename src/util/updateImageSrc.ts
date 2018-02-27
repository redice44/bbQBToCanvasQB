import * as config from 'config';
import * as jsdom from 'jsdom';

export default ( question, newSrc ) => {

  const dom = jsdom.JSDOM.fragment( `<div>${ question.html }</div>` );
  const imgs = dom.querySelectorAll( 'img' );

  for ( let i = 0; i < imgs.length; i++ ) {

    imgs[ i ].setAttribute( 'src', `${ config.get( 'canvas.domain' ) }${ newSrc }` );

  }

  return dom.firstChild.outerHTML;

};
