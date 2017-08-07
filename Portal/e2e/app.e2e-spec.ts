import { NlpPortalPage } from './app.po';

describe('nlp-portal App', () => {
  let page: NlpPortalPage;

  beforeEach(() => {
    page = new NlpPortalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
