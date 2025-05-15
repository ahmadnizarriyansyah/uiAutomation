describe('Tugas 3 - Basic UI Automation OrangeHRM', () => {
  const adminUsername = 'Admin';
  const adminPassword = 'admin123';

  const newEmployee = {
    firstName: 'Budi',
    lastName: 'Santoso',
    username: 'budi123',
    password: 'Password123!',
  };

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('1. Menambahkan Karyawan Baru', () => {
    // Login sebagai admin
    cy.get('input[name="username"]').type(adminUsername);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();

    // Pastikan dashboard muncul
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');

    // Tambah karyawan (menu PIM > Add Employee)
    cy.contains('PIM').click();
    cy.contains('Add Employee').click();
    cy.get('input[name="firstName"]').type(newEmployee.firstName);
    cy.get('input[name="lastName"]').type(newEmployee.lastName);
    cy.get('button[type="submit"]').click();

    // Buat akun untuk karyawan (Admin > Users > Add)
    cy.contains('Admin').click();
    cy.contains('User Management').click();
    cy.contains('Users').click();
    cy.contains('Add').click();
    cy.get('div[role="listbox"]').first().click();
    cy.contains('ESS').click();
    cy.get('input[placeholder="Type for hints..."]').type(newEmployee.firstName);
    cy.wait(2000);
    cy.get('.oxd-autocomplete-option').first().click();
    cy.get('input[name="username"]').type(newEmployee.username);
    cy.get('input[type="password"]').eq(0).type(newEmployee.password);
    cy.get('input[type="password"]').eq(1).type(newEmployee.password);
    cy.get('button[type="submit"]').click();
  });

  it('2. Menambahkan Jatah Cuti untuk Karyawan Baru', () => {
    // Login sebagai admin
    cy.get('input[name="username"]').type(adminUsername);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');

    // Tambah jatah cuti (Leave > Entitlements > Add Entitlements)
    cy.get('.oxd-main-menu').should('be.visible');
    cy.contains('Leave').click();
    cy.contains('Entitlements').click();
    cy.contains('Add Entitlements').click();
    cy.get('input[placeholder="Type for hints..."]').type(newEmployee.firstName);
    cy.wait(2000);
    cy.get('.oxd-autocomplete-option').first().click();
    cy.get('input[type="number"]').type('10');
    cy.get('button[type="submit"]').click();
  });

  it('3. Karyawan Request Cuti dan Admin Approve', () => {
    // Login sebagai karyawan
    cy.get('input[name="username"]').type(newEmployee.username);
    cy.get('input[name="password"]').type(newEmployee.password);
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-main-menu').should('be.visible');

    // Request cuti
    cy.get('.oxd-main-menu').should('be.visible');
    cy.contains('Leave').click();
    cy.contains('Apply').click();
    cy.get('div[role="listbox"]').click();
    cy.contains('Annual Leave').click();
    cy.get('input[placeholder="yyyy-mm-dd"]').eq(0).type('2025-05-20');
    cy.get('input[placeholder="yyyy-mm-dd"]').eq(1).type('2025-05-20');
    cy.get('button[type="submit"]').click();

    // Logout
    cy.get('.oxd-userdropdown-tab').click();
    cy.contains('Logout').click();

    // Login sebagai admin
    cy.get('input[name="username"]').type(adminUsername);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');

    // Approve cuti
    cy.get('.oxd-main-menu').should('be.visible');
    cy.contains('Leave').click();
    cy.contains('Leave List').click();
    cy.get('button[type="submit"]').click(); // cari cuti
    cy.wait(2000);
    cy.get('.oxd-table-card').first().within(() => {
      cy.get('input[type="checkbox"]').check();
    });
    cy.contains('Approve').click();

    // Logout
    cy.get('.oxd-userdropdown-tab').click();
    cy.contains('Logout').click();

    // Login kembali sebagai karyawan
    cy.get('input[name="username"]').type(newEmployee.username);
    cy.get('input[name="password"]').type(newEmployee.password);
    cy.get('button[type="submit"]').click();

    // Cek status cuti
    cy.contains('My Leave').click();
    cy.get('.oxd-table-card').first().should('contain', 'Approved');
  });
});
