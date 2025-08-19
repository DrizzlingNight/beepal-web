<template>
	<div v-show="tempShow" ref="box" class="box">
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		height: {
			type: String,
			default: '0',
		},
		isShow: {
			type: Boolean,
			default: false,
		},
		// pull(下拉效果) | extrusion(擠壓效果) | none(直接打開)
		visualEffect: {
			type: String,
			default: 'none',
		},
		duration: {
			type: Number,
			default: 200
		}
	},
	data() {
		return {
			tempShow: false,
			clientHeight: null,
		}
	},
	watch: {
		isShow(newVal, oldVal) {
			switch (this.visualEffect) {
				case 'pull':
					if (newVal === true) {
						this.tempShow = newVal
						this.$nextTick(() => {
							this.clientHeight =
								(this.height !== 0 && this.height) ||
								(this.$refs.box.childNodes[0] &&
									this.$refs.box.childNodes[0].clientHeight)
							this.$refs.box.childNodes[0].animate(
								[{ height: '0px' }, { height: this.clientHeight + 'px' }],
								{
									duration: this.duration,
								}
							)
						})
					} else {
						this.clientHeight =
							(this.height !== 0 && this.height) ||
							(this.$refs.box.childNodes[0] &&
								this.$refs.box.childNodes[0].clientHeight)
						this.$refs.box.childNodes[0].animate(
							[{ height: this.clientHeight + 'px' }, { height: '0px' }],
							{
								duration: this.duration,
							}
						)
						setTimeout(() => {
							this.tempShow = newVal
						}, this.duration - 20)
					}
					break
				case 'extrusion':
					if (newVal === true) {
						this.$refs.box.animate(
							[{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
							{
								duration: this.duration,
								fill: 'forwards',
							}
						)
						this.tempShow = newVal
					} else {
						this.$refs.box.animate(
							[{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }],
							{
								duration: this.duration,
								fill: 'forwards',
							}
						)
						setTimeout(() => {
							this.tempShow = newVal
						}, this.duration - 10)
					}
					break
				case 'none':
					this.tempShow = newVal
					break
			}
		},
	},
	mounted() {
		document.addEventListener(
			'click',
			(e) => {
				if (this.$refs.box && this.$refs.box.parentElement.contains(e.target)) {
					return
				}
				this.$emit('showBox', false)
			},
			true
		)
	},
}
</script>

<style lang="scss" scoped>
.box {
	position: relative;
	z-index: 11;
	transform-origin: 0 0;
}
</style>
