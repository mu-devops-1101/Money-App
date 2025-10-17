Feature: E2E Transaction Management and Reporting Flow

  Background:
    * url 'http://localhost:8080/api'
    * header Accept = 'application/json'
    * header Content-Type = 'application/json'
    * configure ssl = true

  Scenario: Complete E2E Transaction Flow Test
    
    # ==========================================
    # STEP 1: Authentication Setup
    # ==========================================
    * def uniqueUsername = 'user_' + java.util.UUID.randomUUID().toString().substring(0, 8)
    * def uniquePassword = 'password123'
    * print 'Starting with Username:', uniqueUsername
    
    # Register
    Given path '/auth/register'
    And request { username: '#(uniqueUsername)', password: '#(uniquePassword)' }
    When method POST
    Then status 200
    And match response == 'User registered successfully!'
    
    # Login
    Given path '/auth/login'
    And request { username: '#(uniqueUsername)', password: '#(uniquePassword)' }
    When method POST
    Then status 200
    And match response.jwt != null
    * def jwtToken = response.jwt
    * print 'JWT Token obtained:', jwtToken
    # Configure Authorization header for ALL subsequent requests
    * configure headers = { Authorization: '#("Bearer " + jwtToken)' }
    
    # ==========================================
    # STEP 2: Customization (Category and Payment Method CRUD)
    # ==========================================
    
    # --- Category CRUD ---
    # POST: เพิ่มหมวดหมู่ใหม่
    Given path '/v1/categories'
    And request { name: 'Food & Drinks' }
    When method POST
    Then status 200
    And match response.name == 'Food & Drinks'
    * def categoryId = response.id
    
    # PUT: แก้ไขหมวดหมู่
    Given path '/v1/categories/' + categoryId
    And request { name: 'Updated Food & Dining' }
    When method PUT
    Then status 200
    And match response.name == 'Updated Food & Dining'
    
    # GET: ดูรายการทั้งหมด
    Given path '/v1/categories'
    When method GET
    Then status 200
    And match response[*].name contains 'Updated Food & Dining'
    
    # --- Payment Method CRUD ---
    # POST: เพิ่มวิธีการชำระเงินใหม่
    Given path '/v1/payment-methods'
    And request { name: 'Credit Card' }
    When method POST
    Then status 200
    And match response.name == 'Credit Card'
    * def paymentMethodId = response.id
    
    # PUT: แก้ไขวิธีการชำระเงิน
    Given path '/v1/payment-methods/' + paymentMethodId
    And request { name: 'VISA Credit Card' }
    When method PUT
    Then status 200
    And match response.name == 'VISA Credit Card'
    
    # NOTE: เก็บ Category และ Payment Method ไว้ใช้ในขั้นตอนถัดไป
    # ไม่ลบทิ้งเพราะจะใช้สร้าง Transaction
    * def testCategoryId = categoryId
    * def testPaymentMethodId = paymentMethodId
    
    # ==========================================
    # STEP 3: Transaction CRUD Operations
    # ==========================================
    
    # ใช้ Category และ Payment Method ที่สร้างไว้แล้วจาก STEP 2
    # (testCategoryId และ testPaymentMethodId)
    
    # POST: เพิ่มธุรกรรมใหม่ (รายรับ)
    Given path '/v1/transactions'
    And request
      """
      {
        type: 'INCOME',
        amount: 50000.50,
        dateTime: '2025-10-15T12:00:00',
        location: 'Company',
        note: 'Monthly Salary',
        category: { id: '#(testCategoryId)' },
        paymentMethod: { id: '#(testPaymentMethodId)' }
      }
      """
    When method POST
    * print 'POST Transaction Response Status:', responseStatus
    * print 'POST Transaction Response:', response
    Then status 200
    And match response.type == 'INCOME'
    And match response.amount == 50000.50
    * def newTransactionId = response.id
    * print 'Created Transaction ID:', newTransactionId
    
    # GET: ดูรายละเอียดเต็มของธุรกรรม
    Given path '/v1/transactions/' + newTransactionId
    When method GET
    Then status 200
    * print 'GET Transaction Response:', response
    And match response.id == newTransactionId
    And match response.category.id == testCategoryId
    And match response.amount == 50000.50
    And match response.type == 'INCOME'
    
    # PUT: แก้ไขรายละเอียดของธุรกรรม
    Given path '/v1/transactions/' + newTransactionId
    And request
      """
      {
        type: 'EXPENSE',
        amount: 50.50,
        dateTime: '2025-10-15T12:00:00',
        location: 'Coffee Shop',
        note: 'Morning Coffee',
        category: { id: '#(testCategoryId)' },
        paymentMethod: { id: '#(testPaymentMethodId)' }
      }
      """
    When method PUT
    * print 'PUT Transaction Response Status:', responseStatus
    * print 'PUT Transaction Response:', response
    Then status 200
    And match response.type == 'EXPENSE'
    And match response.amount == 50.50
    
    # GET ALL: ดูรายการธุรกรรมทั้งหมด (หลังแก้ไข)
    Given path '/v1/transactions'
    When method GET
    Then status 200
    * print 'GET ALL Transactions:', response
    # ตรวจสอบว่า Transaction ที่สร้างอยู่ใน list
    And match response[*].id contains newTransactionId
    # ตรวจสอบว่า Transaction ถูกอัปเดตแล้ว
    * def updatedTx = response.find(tx => tx.id == newTransactionId)
    * print 'Updated Transaction in list:', updatedTx
    And match updatedTx.amount == 50.50
    And match updatedTx.type == 'EXPENSE'
    
    # DELETE: ลบธุรกรรม
    Given path '/v1/transactions/' + newTransactionId
    When method DELETE
    Then status 204
    
    # GET: ตรวจสอบว่าถูกลบแล้ว
    Given path '/v1/transactions/' + newTransactionId
    When method GET
    Then status 404
    
    # ==========================================
    # STEP 4: Monthly Summary Report
    # ==========================================
    
    # Setup: สร้างข้อมูลสำหรับทดสอบ Monthly Summary
    Given path '/v1/categories'
    And request { name: 'Expense_Cat' }
    When method POST
    Then status 200
    * def expCatId = response.id
    
    Given path '/v1/categories'
    And request { name: 'Income_Cat' }
    When method POST
    Then status 200
    * def incCatId = response.id
    
    Given path '/v1/payment-methods'
    And request { name: 'Wallet' }
    When method POST
    Then status 200
    * def walletPmId = response.id
    
    # Add Income: 1000.00 (Oct 1)
    Given path '/v1/transactions'
    And request
      """
      {
        type: 'INCOME',
        amount: 1000.00,
        dateTime: '2025-10-01T08:00:00',
        category: { id: '#(incCatId)' },
        paymentMethod: { id: '#(walletPmId)' }
      }
      """
    When method POST
    Then status 200
    
    # Add Expense: 200.00 (Oct 15)
    Given path '/v1/transactions'
    And request
      """
      {
        type: 'EXPENSE',
        amount: 200.00,
        dateTime: '2025-10-15T10:00:00',
        category: { id: '#(expCatId)' },
        paymentMethod: { id: '#(walletPmId)' }
      }
      """
    When method POST
    Then status 200
    
    # Add Expense: 50.00 (Previous Month - Should NOT be included)
    Given path '/v1/transactions'
    And request
      """
      {
        type: 'EXPENSE',
        amount: 50.00,
        dateTime: '2025-09-28T10:00:00',
        category: { id: '#(expCatId)' },
        paymentMethod: { id: '#(walletPmId)' }
      }
      """
    When method POST
    Then status 200
    
    # GET: ดูสรุปรายเดือน
    Given path '/v1/transactions/monthly-summary/2025/10'
    When method GET
    Then status 200
    * print 'Monthly Summary Response:', response
    And match response.totalIncome == 1000.00
    And match response.totalExpense == 200.00
    And match response.balance == 800.0