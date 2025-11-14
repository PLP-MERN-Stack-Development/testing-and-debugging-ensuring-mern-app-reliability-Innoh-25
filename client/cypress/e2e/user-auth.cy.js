describe('User Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user', () => {
    cy.intercept('POST', '/api/auth/register').as('registerRequest');

    cy.get('[data-testid="register-link"]').click();
    
    cy.get('[data-testid="username-input"]').type('newuser');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('password123');
    
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-greeting"]').should('contain', 'newuser');
  });

  it('should login existing user', () => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-greeting"]').should('contain', 'testuser');
  });

  it('should show error for invalid login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' },
    }).as('loginRequest');

    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest');

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
    
    cy.url().should('include', '/login');
  });

  it('should logout user', () => {
    // First login
    cy.login('test@example.com', 'password123');
    
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();

    cy.url().should('include', '/login');
    cy.get('[data-testid="login-form"]').should('be.visible');
  });
});