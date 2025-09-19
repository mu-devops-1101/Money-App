<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-gutter-md">
      <q-card v-if="!isLoggedIn" class="q-pa-md shadow-2 rounded-borders">
        <q-card-section>
          <div class="text-h6 text-center">เข้าสู่ระบบ / ลงทะเบียน</div>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="username" label="Username" class="q-mb-md" />
          <q-input outlined v-model="password" label="Password" type="password" class="q-mb-md" />
          <div class="row q-gutter-md justify-center">
            <q-btn color="primary" label="ลงทะเบียน" @click="handleRegister" />
            <q-btn color="secondary" label="เข้าสู่ระบบ" @click="handleLogin" />
          </div>
        </q-card-section>
      </q-card>

      <q-card v-if="isLoggedIn" class="q-pa-md shadow-2 rounded-borders">
        <q-card-section>
          <div class="text-h6 text-center">เครื่องมือทดสอบ API</div>
          <q-btn class="full-width q-mt-md" color="negative" label="ออกจากระบบ" @click="handleLogout" />
          <q-banner dense rounded class="text-white q-mt-md" :class="message.includes('ไม่สำเร็จ') ? 'bg-red' : 'bg-green'">
            <template v-slot:avatar>
              <q-icon name="info" />
            </template>
            {{ message }}
          </q-banner>
        </q-card-section>

        <!-- Transaction API Section -->
        <q-expansion-item
          header-class="bg-blue-grey-8 text-white"
          expand-icon-class="text-white"
          label="ธุรกรรม"
          class="q-mt-md rounded-borders"
        >
          <q-card class="bg-blue-grey-1">
            <q-card-section>
              <q-input outlined v-model="amount" type="number" label="ยอดเงิน" class="q-mb-md" />
              <q-input outlined v-model="note" label="บันทึก" class="q-mb-md" />
              <div class="row q-gutter-md justify-center">
                <q-btn color="primary" label="เพิ่มธุรกรรม" @click="handleAddTransaction" />
                <q-btn color="secondary" label="แก้ไข" @click="handleUpdateTransaction" :disable="!selectedTransaction" />
                <q-btn color="grey" label="รีเซ็ต" @click="resetForm" />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-h6">รายการธุรกรรม</div>
              <q-list bordered separator>
                <q-item v-for="item in transactions" :key="item.id" clickable v-ripple @click="selectTransaction(item)">
                  <q-item-section>
                    <q-item-label>{{ item.note }}</q-item-label>
                    <q-item-label caption>{{ item.amount }} บาท</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat round icon="delete" color="negative" @click.stop="handleDeleteTransaction(item.id)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Category API Section -->
        <q-expansion-item
          header-class="bg-blue-grey-8 text-white"
          expand-icon-class="text-white"
          label="หมวดหมู่"
          class="q-mt-md rounded-borders"
        >
          <q-card class="bg-blue-grey-1">
            <q-card-section>
              <q-input outlined v-model="categoryName" label="ชื่อหมวดหมู่" class="q-mb-md" />
              <q-btn class="full-width" color="primary" label="เพิ่มหมวดหมู่" @click="handleAddCategory" />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-h6">รายการหมวดหมู่</div>
              <q-list bordered separator>
                <q-item v-for="item in categories" :key="item.id">
                  <q-item-section>{{ item.name }}</q-item-section>
                  <q-item-section side>
                    <q-btn flat round icon="delete" color="negative" @click="handleDeleteCategory(item.id)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        
        <!-- Payment Method API Section -->
        <q-expansion-item
          header-class="bg-blue-grey-8 text-white"
          expand-icon-class="text-white"
          label="วิธีการชำระเงิน"
          class="q-mt-md rounded-borders"
        >
          <q-card class="bg-blue-grey-1">
            <q-card-section>
              <q-input outlined v-model="paymentMethodName" label="ชื่อวิธีชำระเงิน" class="q-mb-md" />
              <q-btn class="full-width" color="primary" label="เพิ่มวิธีชำระเงิน" @click="handleAddPaymentMethod" />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-h6">รายการวิธีการชำระเงิน</div>
              <q-list bordered separator>
                <q-item v-for="item in paymentMethods" :key="item.id">
                  <q-item-section>{{ item.name }}</q-item-section>
                  <q-item-section side>
                    <q-btn flat round icon="delete" color="negative" @click="handleDeletePaymentMethod(item.id)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

// ** แก้ไข URL นี้ให้ตรงกับ Backend ของคุณ **
const API_URL = 'http://localhost:8080/api/v1';

const $q = useQuasar();

const isLoggedIn = ref(false);
const username = ref('');
const password = ref('');
const token = ref('');
const message = ref('โปรดเข้าสู่ระบบ');

// Transaction States
const transactions = ref([]);
const amount = ref('');
const note = ref('');
const selectedTransaction = ref(null);

// Category States
const categories = ref([]);
const categoryName = ref('');

// Payment Method States
const paymentMethods = ref([]);
const paymentMethodName = ref('');

// --- API Authentication ---
async function handleRegister() {
  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: username.value,
      passwordHash: password.value,
    });
    message.value = 'ลงทะเบียนสำเร็จ! กรุณาล็อกอิน';
    showNotify('ลงทะเบียนสำเร็จ!', 'green');
  } catch (error) {
    message.value = `ลงทะเบียนไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

async function handleLogin() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: username.value,
      passwordHash: password.value,
    });
    token.value = response.data.jwt;
    isLoggedIn.value = true;
    message.value = 'ล็อกอินสำเร็จ!';
    showNotify('ล็อกอินสำเร็จ!', 'green');
    fetchData();
  } catch (error) {
    message.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    showNotify(message.value, 'red');
  }
}

function handleLogout() {
  token.value = '';
  isLoggedIn.value = false;
  username.value = '';
  password.value = '';
  transactions.value = [];
  categories.value = [];
  paymentMethods.value = [];
  message.value = 'ออกจากระบบสำเร็จ';
  showNotify('ออกจากระบบสำเร็จ!', 'blue');
}

// --- Data Fetching ---
async function fetchData() {
  if (isLoggedIn.value) {
    await fetchTransactions();
    await fetchCategories();
    await fetchPaymentMethods();
  }
}

async function fetchTransactions() {
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    transactions.value = response.data;
  } catch (error) {
    message.value = 'ไม่สามารถโหลดธุรกรรมได้';
  }
}

async function fetchCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    categories.value = response.data;
  } catch (error) {
    message.value = 'ไม่สามารถโหลดหมวดหมู่ได้';
  }
}

async function fetchPaymentMethods() {
  try {
    const response = await axios.get(`${API_URL}/payment-methods`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    paymentMethods.value = response.data;
  } catch (error) {
    message.value = 'ไม่สามารถโหลดวิธีการชำระเงินได้';
  }
}

// --- Transaction API Tests ---
async function handleAddTransaction() {
  try {
    await axios.post(`${API_URL}/transactions`, {
      amount: parseFloat(amount.value),
      note: note.value,
      type: "EXPENSE",
    }, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'เพิ่มธุรกรรมสำเร็จ!';
    showNotify('เพิ่มธุรกรรมสำเร็จ!', 'green');
    resetForm();
    await fetchTransactions();
  } catch (error) {
    message.value = `เพิ่มธุรกรรมไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

async function handleUpdateTransaction() {
  if (!selectedTransaction.value) {
    showNotify("โปรดเลือกธุรกรรมที่ต้องการแก้ไข", 'orange');
    return;
  }
  try {
    await axios.put(`${API_URL}/transactions/${selectedTransaction.value.id}`, {
      ...selectedTransaction.value,
      amount: parseFloat(amount.value),
      note: note.value,
    }, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'แก้ไขธุรกรรมสำเร็จ!';
    showNotify('แก้ไขธุรกรรมสำเร็จ!', 'green');
    resetForm();
    await fetchTransactions();
  } catch (error) {
    message.value = `แก้ไขธุรกรรมไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

async function handleDeleteTransaction(id) {
  try {
    await axios.delete(`${API_URL}/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'ลบธุรกรรมสำเร็จ!';
    showNotify('ลบธุรกรรมสำเร็จ!', 'green');
    await fetchTransactions();
  } catch (error) {
    message.value = `ลบธุรกรรมไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

function selectTransaction(item) {
  selectedTransaction.value = item;
  amount.value = item.amount.toString();
  note.value = item.note;
  showNotify('เลือกธุรกรรมเพื่อแก้ไข', 'blue');
}

function resetForm() {
  amount.value = '';
  note.value = '';
  selectedTransaction.value = null;
}

// --- Category API Tests ---
async function handleAddCategory() {
  try {
    await axios.post(`${API_URL}/categories`, { name: categoryName.value }, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'เพิ่มหมวดหมู่สำเร็จ!';
    showNotify('เพิ่มหมวดหมู่สำเร็จ!', 'green');
    categoryName.value = '';
    await fetchCategories();
  } catch (error) {
    message.value = `เพิ่มหมวดหมู่ไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

async function handleDeleteCategory(id) {
  try {
    await axios.delete(`${API_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'ลบหมวดหมู่สำเร็จ!';
    showNotify('ลบหมวดหมู่สำเร็จ!', 'green');
    await fetchCategories();
  } catch (error) {
    message.value = `ลบหมวดหมู่ไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

// --- Payment Method API Tests ---
async function handleAddPaymentMethod() {
  try {
    await axios.post(`${API_URL}/payment-methods`, { name: paymentMethodName.value }, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'เพิ่มวิธีการชำระเงินสำเร็จ!';
    showNotify('เพิ่มวิธีการชำระเงินสำเร็จ!', 'green');
    paymentMethodName.value = '';
    await fetchPaymentMethods();
  } catch (error) {
    message.value = `เพิ่มวิธีการชำระเงินไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

async function handleDeletePaymentMethod(id) {
  try {
    await axios.delete(`${API_URL}/payment-methods/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    message.value = 'ลบวิธีการชำระเงินสำเร็จ!';
    showNotify('ลบวิธีการชำระเงินสำเร็จ!', 'green');
    await fetchPaymentMethods();
  } catch (error) {
    message.value = `ลบวิธีการชำระเงินไม่สำเร็จ: ${error.response?.data || error.message}`;
    showNotify(message.value, 'red');
  }
}

// Quasar Notify
function showNotify(msg, color) {
  $q.notify({
    message: msg,
    color: color,
    position: 'top',
    timeout: 2000,
  });
}
</script>
```
eof

---

### **วิธีรันโปรเจกต์**

1.  **ติดตั้งแพลตฟอร์ม Mobile**:
    รันคำสั่งเพื่อเพิ่มแพลตฟอร์มที่คุณต้องการ เช่น Android หรือ iOS:
    ```bash
    quasar dev -m android
    # or
    quasar dev -m ios
    ```

2.  **รันแอปบน Emulator**:
    ใช้คำสั่งเดิมเพื่อรันแอปบน Emulator ที่คุณติดตั้งไว้ (Android Studio / Xcode):
    ```bash
    quasar dev -m android
    # or
    quasar dev -m ios
    
