<template>
	<div class="gallery-item">
		<p
            v-if="previewable" 
            class="thumbnail-preview" 
            @click.prevent="$emit('preview', index)">
			<i class="icon-search"/>
		</p>
		<p class="thumbnail-delete" @click.stop.prevent="$emit('remove', index)">
			<i class="icon-times"/>
		</p>

		<vl-spinner-icon :loading="!image.src" />

		<img v-if="image.src"
			:src="image.src" 
			:alt="image.name" 
			:style="{height: height}"
			class="gallery-image">
	</div>
</template>

<script>

export default {
	props: {
		image: {type: File|Object, required: true}, 
		index: {type: Number, required: true},
		height: {type: String, required: false},
		previewable: {type: Boolean, default: true}
	}
}
</script>
