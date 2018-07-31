import { LearnFrontendPage } from './app.po';

describe('learn-frontend App', () => {
  let page: LearnFrontendPage;

  beforeEach(() => {
    page = new LearnFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
