<template>
    <div :class="['image-uploader', customClass]">
      <div v-if="label">
        <label class="">{{ label }}</label>
      </div>
  
      <div v-if="!imageUrl && !previewUrl" class="drop-area" :style="dropAreaStyle"
           @dragover.prevent="isDragging = true"
           @dragleave.prevent="isDragging = false"
           @drop.prevent="onDrop"
           :class="{ dragging: isDragging }">
        <input class="file-input" type="file" accept="image/*" @change="onFileChange" />
        <div class="drop-text">
          <p>Drag & drop or click to upload</p>
        </div>
      </div>
  
      <div v-else-if="imageUrl" class="crop-container">
        <cropper ref="cropperRef" :src="imageUrl" class="cropper"
                 :stencil-component="cropType === 'round' ? CircleStencil : RectangleStencil"
                 :stencil-props="stencilOptions"
                 :background="true" :autoZoom="true" />
        <div class="d-flex justify-content-end m-3">
          <a href="javascript:;" class="btn btn-primary me-2" @click="cropImage">Crop</a>
          <button class="btn btn-gray" @click="reset">Cancel</button>
        </div>
      </div>
  
      <div v-else class="preview-box" :style="dropAreaStyle">
        <img :src="previewUrl" :class="['cropped-preview', { 'rounded-circle': cropType === 'round' }]" />
        <button class="btn btn-sm remove-btn" @click="reset">×</button>
      </div>
    </div>
    <small v-if="halpertext">{{ halpertext }}</small>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper'
  import 'vue-advanced-cropper/dist/style.css'
  import 'vue-advanced-cropper/dist/theme.compact.css'
  
  const props = defineProps({
    halpertext:{type:String},
    modelValue: File,
    imageUrl: String,
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '200px' },
    label: String,
    customClass: String,
    cropType: { type: String, default: 'square' },
    customAspectRatio: { type: Number, default: 1 }
  })
  
  const emit = defineEmits(['update:modelValue', 'update:imageUrl'])
  
  const isDragging = ref(false)
  const imageUrl = ref(null)
  const previewUrl = ref(props.imageUrl || null)
  const cropperRef = ref(null)
  
  const dropAreaStyle = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height
  }))
  
  const computedAspect = computed(() => {
    if (props.cropType === 'banner') return 3
    if (props.cropType === 'custom') return props.customAspectRatio
    return 1
  })
  
  const isRound = computed(() => props.cropType === 'round')
  
  const stencilOptions = computed(() => ({
    aspectRatio: computedAspect.value,
    movable: true,
    scalable: true,
    resizable: true,
    handlers: ['corners'],
    lines: { vertical: true, horizontal: true },
    round: isRound.value
  }))
  
  watch(() => props.imageUrl, (val) => {
    previewUrl.value = val
    imageUrl.value = null
  })
  
  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file?.type.startsWith('image/')) {
      imageUrl.value = URL.createObjectURL(file)
      previewUrl.value = null
    }
  }
  
  const onDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      imageUrl.value = URL.createObjectURL(file)
      previewUrl.value = null
    }
  }
  
  const cropImage = () => {
    const result = cropperRef.value?.getResult()
    if (result?.canvas) {
      result.canvas.toBlob(blob => {
        const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
        const preview = result.canvas.toDataURL('image/jpeg')
        previewUrl.value = preview
        imageUrl.value = null
        emit('update:modelValue', file)
        emit('update:imageUrl', preview)
      }, 'image/jpeg')
    }
  }
  
  const reset = () => {
    imageUrl.value = null
    previewUrl.value = null
    emit('update:modelValue', null)
    emit('update:imageUrl', null)
  }
  </script>
  
  <style scoped>
  .image-uploader {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .drop-area {
    position: relative;
    border: 1px dashed #ccc;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #f9f9f9;
    text-align: center;
    overflow: hidden;
  }
  .vue-advanced-cropper__background,
  .vue-advanced-cropper__foreground {
    background: transparent !important;
  }
  .drop-area.dragging {
    border-color: #007bff;
    background-color: #f0f8ff;
  }
  .file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .drop-text p {
    color: #6c757d;
    font-weight: 500;
    margin: 0;
  }
  .crop-container {
    position: relative;
    width: 100%;
    border: 1px dashed #ccc;
    border-radius: 6px;
  }
  .cropper {
    width: 100%;
    height: 300px;
  }
  .preview-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ccc;
    border-radius: 6px;
    overflow: hidden;
    padding: 10px;
  }
  .cropped-preview {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .rounded-circle {
    border-radius: 50%;
  }
  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 1.2rem;
    padding: 1px 10px 4px 10px;
    background-color: rgba(255, 0, 0, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
  .dark .drop-area {
    background: transparent !important;
  }
  </style>
  