/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
  })

  it('should connect to frontend and rss feeds', () => {
    cy.visit('http://localhost:8080/')
    cy.wait(10000)
    cy.get('a[href*="#/RssFlows"]').click()
    cy.contains('RSS FEEDS')
  })
})
