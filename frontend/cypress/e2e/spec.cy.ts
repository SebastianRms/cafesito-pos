describe('Sistema Cafecito Feliz POS', () => {
  
  it('debe completar una venta desde el login hasta el ticket final', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('sebas@example.com');
    cy.get('input[name="password"]').type('AdminPassword123');
    
    cy.get('button').contains('Iniciar Sesión').click();

    cy.url().should('include', '/pos');
    cy.contains('Tu Pedido').should('be.visible');

    cy.get('button').contains('AGREGAR').first().click();
    
    cy.get('.text-orange-600.text-2xl').should('not.contain', '$0');

    cy.get('button').contains('Efectivo').click();

    cy.get('button').contains('Confirmar y Cobrar').click();

    cy.get('.fixed.inset-0').should('be.visible'); 
    cy.contains('¡Gracias por su compra en Cafecito Feliz!').should('be.visible');

    cy.get('button').contains('Nueva Venta').click();

    cy.get('.fixed.inset-0').should('not.exist');
  });

});