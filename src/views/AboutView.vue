<template>
  <div>
    <h1>This is an about page</h1>
    <div v-if="isAuthenticated">
      <form @submit.prevent="handleUpload">
        <div class="form-group">
          <label for="file">Upload File:</label>
          <input type="file" id="file" @change="onFileChange" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Upload</button>
      </form>
      <h2>Uploaded Files</h2>
      <ul>
        <li v-for="file in files" :key="file">
          <a :href="file" target="_blank">{{ getFileDisplayName(file) }}</a>
          <button @click="deleteFile(file)" class="btn btn-danger btn-sm">Delete</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Please log in to upload files.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AboutView',
  setup() {
    const store = useStore()
    const file = ref(null)
    const files = ref([])
    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/files/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        files.value = response.data
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }

    onMounted(() => {
      if (isAuthenticated.value) {
        fetchFiles()
      }
    })

    const onFileChange = (e) => {
      file.value = e.target.files[0]
    }

    const handleUpload = async () => {
      if (!file.value) {
        alert('Please select a file first!')
        return
      }

      const formData = new FormData()
      formData.append('file', file.value)

      try {
        await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        alert('File uploaded successfully')
        fetchFiles()  // 重新獲取文件列表
      } catch (error) {
        console.error('Upload error:', error.response ? error.response.data : error.message)
        alert('An error occurred during file upload.')
      }
    }

    const deleteFile = async (fileUrl) => {
      const filename = fileUrl.split('/').pop()
      try {
        await axios.delete(`http://127.0.0.1:8000/api/delete/${filename}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        alert('File deleted successfully')
        fetchFiles()  // 重新獲取文件列表
      } catch (error) {
        console.error('Delete error:', error.response ? error.response.data : error.message)
        alert('An error occurred during file deletion.')
      }
    }

    const getFileDisplayName = (fileUrl) => {
      return fileUrl.split('/').pop().split('_').slice(2).join('_')
    }

    return {
      isAuthenticated,
      file,
      files,
      onFileChange,
      handleUpload,
      deleteFile,
      getFileDisplayName
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
</style>

