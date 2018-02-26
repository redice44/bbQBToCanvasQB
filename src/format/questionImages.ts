import * as jsdom from 'jsdom';

export default question => {

  const dom = jsdom.JSDOM.fragment( question.html );
  const imgs = dom.querySelectorAll( 'img' );
  const imgUrls = [];

  for ( let i = 0; i < imgs.length; i++ ) {

    imgUrls.push( imgs[ i ].getAttribute( 'src' ).split( '/' )[ 1 ] );

  }

  return imgUrls;

};
