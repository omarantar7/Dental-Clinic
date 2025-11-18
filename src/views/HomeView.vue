<script setup lang="ts">
import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const search = ref("");

const filters = ref({
  name: "",
  email: "",
  role: "",
  status: "",
});

const roleOptions = ["Admin", "Manager", "User"];

const headers = [
  { title: "ID", key: "id", align: "start" as const },
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Role", key: "role" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

const users = ref<User[]>([
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: Math.random(),
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
]);

const dialog = ref(false);
const deleteDialog = ref(false);
const isViewMode = ref(false);
const editedIndex = ref(-1);
const editedUser = ref<User>({
  id: 0,
  name: "",
  email: "",
  role: "",
  status: "Active",
});

const defaultUser: User = {
  id: 0,
  name: "",
  email: "",
  role: "",
  status: "Active",
};

const userToDelete = ref<User | null>(null);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const dialogTitle = ref("Add User");

const filteredUsers = computed(() => {
  let result = users.value;

  // Apply global search
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.status.toLowerCase().includes(searchLower)
    );
  }

  // Apply column filters
  if (filters.value.name) {
    const nameLower = filters.value.name.toLowerCase();
    result = result.filter((user) =>
      user.name.toLowerCase().includes(nameLower)
    );
  }

  if (filters.value.email) {
    const emailLower = filters.value.email.toLowerCase();
    result = result.filter((user) =>
      user.email.toLowerCase().includes(emailLower)
    );
  }

  if (filters.value.role) {
    result = result.filter((user) => user.role === filters.value.role);
  }

  if (filters.value.status) {
    result = result.filter((user) => user.status === filters.value.status);
  }

  return result;
});

const openCreateDialog = () => {
  editedIndex.value = -1;
  editedUser.value = { ...defaultUser };
  dialogTitle.value = "Add User";
  isViewMode.value = false;
  dialog.value = true;
};

const openViewDialog = (user: User) => {
  editedUser.value = { ...user };
  dialogTitle.value = "View User";
  isViewMode.value = true;
  dialog.value = true;
};

const openEditDialog = (user: User) => {
  editedIndex.value = users.value.findIndex((u) => u.id === user.id);
  editedUser.value = { ...user };
  dialogTitle.value = "Edit User";
  isViewMode.value = false;
  dialog.value = true;
};

const openDeleteDialog = (user: User) => {
  userToDelete.value = user;
  deleteDialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
    editedUser.value = { ...defaultUser };
    editedIndex.value = -1;
    isViewMode.value = false;
  }, 300);
};

const saveUser = () => {
  if (editedIndex.value > -1) {
    // Edit existing user
    Object.assign(users.value[editedIndex.value] as any, editedUser.value);
    showSnackbar("User updated successfully", "success");
  } else {
    // Add new user
    editedUser.value.id = Math.max(...users.value.map((u) => u.id)) + 1;
    users.value.push({ ...editedUser.value });
    showSnackbar("User added successfully", "success");
  }
  closeDialog();
};

const deleteUser = () => {
  if (userToDelete.value) {
    const index = users.value.findIndex((u) => u.id === userToDelete.value!.id);
    if (index > -1) {
      users.value.splice(index, 1);
      showSnackbar("User deleted successfully", "error");
    }
  }
  deleteDialog.value = false;
  userToDelete.value = null;
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>User Management</span>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          Add User
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:header.name="{ column }">
            <div class="d-flex align-center">
              {{ column.title }}
              <v-menu offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    v-bind="props"
                    class="ml-1"
                  >
                    <v-icon size="small" :color="filters.name ? 'primary' : ''">
                      mdi-filter-variant
                    </v-icon>
                  </v-btn>
                </template>
                <v-card min-width="200">
                  <v-card-text>
                    <v-text-field
                      v-model="filters.name"
                      label="Filter Name"
                      density="compact"
                      clearable
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </template>

          <template v-slot:header.email="{ column }">
            <div class="d-flex align-center">
              {{ column.title }}
              <v-menu offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    v-bind="props"
                    class="ml-1"
                  >
                    <v-icon
                      size="small"
                      :color="filters.email ? 'primary' : ''"
                    >
                      mdi-filter-variant
                    </v-icon>
                  </v-btn>
                </template>
                <v-card min-width="200">
                  <v-card-text>
                    <v-text-field
                      v-model="filters.email"
                      label="Filter Email"
                      density="compact"
                      clearable
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </template>

          <template v-slot:header.role="{ column }">
            <div class="d-flex align-center">
              {{ column.title }}
              <v-menu offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    v-bind="props"
                    class="ml-1"
                  >
                    <v-icon size="small" :color="filters.role ? 'primary' : ''">
                      mdi-filter-variant
                    </v-icon>
                  </v-btn>
                </template>
                <v-card min-width="200">
                  <v-card-text>
                    <v-select
                      v-model="filters.role"
                      :items="roleOptions"
                      label="Filter Role"
                      density="compact"
                      clearable
                    ></v-select>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </template>

          <template v-slot:header.status="{ column }">
            <div class="d-flex align-center">
              {{ column.title }}
              <v-menu offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    v-bind="props"
                    class="ml-1"
                  >
                    <v-icon
                      size="small"
                      :color="filters.status ? 'primary' : ''"
                    >
                      mdi-filter-variant
                    </v-icon>
                  </v-btn>
                </template>
                <v-card min-width="200">
                  <v-card-text>
                    <v-select
                      v-model="filters.status"
                      :items="['Active', 'Inactive']"
                      label="Filter Status"
                      density="compact"
                      clearable
                    ></v-select>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              size="small"
              class="me-2"
              @click="openViewDialog(item)"
              color="info"
            >
              mdi-eye
            </v-icon>
            <v-icon
              size="small"
              class="me-2"
              @click="openEditDialog(item)"
              color="primary"
            >
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="openDeleteDialog(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.name"
                  label="Name"
                  :readonly="isViewMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.email"
                  label="Email"
                  type="email"
                  :readonly="isViewMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.role"
                  label="Role"
                  :readonly="isViewMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedUser.status"
                  :items="['Active', 'Inactive']"
                  label="Status"
                  :readonly="isViewMode"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">
            {{ isViewMode ? "Close" : "Cancel" }}
          </v-btn>
          <v-btn
            v-if="!isViewMode"
            color="primary"
            variant="text"
            @click="saveUser"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ userToDelete?.name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="deleteUser">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>
