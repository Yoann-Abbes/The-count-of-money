/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
  })

  it('should connect to frontend and go to bitcoin currency details', () => {
    cy.visit('http://localhost:8080/')
    cy.get('a[href*="/CryptoDetails/BTC"]').click()
    cy.get('.apexcharts-svg')
  })
})
