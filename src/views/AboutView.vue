<template>
<section>
  <h1>This is an about page</h1>
  <div class="container">
    <div
        @dragover.prevent
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{'dragover': isDragOver}"
        class="drag-drop-area"
        >
        <p>Drag files here to upload</p>
    </div>
  </div>
  <div class="pt-2 pb-2">
    <label>Upload File:</label>
    <input type="file" @change="handleFileChange" />
  </div>
</section>
    <button @click="uploadFile" class="btn btn-primary">Upload</button>
<br>
<hr>
<br>
<section>
  <div>
    <h2>Uploaded Files</h2>
    <ul>
      <li v-for="file in uploadedFiles" :key="file">
        <a :href="file" target="_blank">{{ file }}</a>
        <button @click="deleteFile(file)" class="btn btn-danger btn-sm">Delete</button>
      </li>
    </ul>
  </div>
</section>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      selectedFile: null,
      uploadedFiles: [],
      isDragOver: false
    }
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0]
    },
    async uploadFile() {
      if (!this.selectedFile) {
        Swal.fire('No file selected', 'Please select a file to upload', 'warning')
        return
      }

      const formData = new FormData()
      formData.append('file', this.selectedFile)

      try {
        await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        Swal.fire('File uploaded successfully', '', 'success')
        this.fetchUploadedFiles()
      } catch (error) {
        Swal.fire('An error occurred during file upload', '', 'error')
      }
    },
    async fetchUploadedFiles() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/files/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        this.uploadedFiles = response.data
      } catch (error) {
        console.error('An error occurred while fetching files:', error)
      }
    },
    async deleteFile(fileUrl) {
      const filename = fileUrl.split('/').pop()
      try {
        await axios.delete(`http://127.0.0.1:8000/api/delete/${filename}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        Swal.fire('File deleted successfully', '', 'success')
        this.fetchUploadedFiles()
      } catch (error) {
        Swal.fire('An error occurred while deleting file', '', 'error')
      }
    },
    handleDragEnter() {
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    },
    handleDrop(event) {
      this.isDragOver = false
      this.selectedFile = event.dataTransfer.files[0]
      this.uploadFile()
    }
  },
  mounted() {
    this.fetchUploadedFiles()
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-drop-area {
  border: 2px dashed #cccccc;
  padding: 20px;
  text-align: center;
  width: 500px; 
  height: 500px; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-drop-area.dragover {
  border-color: #0000ff;
  background-color: #e0e0e0;
}

.drag-drop-area p {
  margin: 0;
  font-size: 16px;
}
</style>
