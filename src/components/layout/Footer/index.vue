<template>
  <div class="line">
    <p>Copyright©北京亿美软通科技有限公司</p>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style>

.line {
	width: 100%;
	height: 50px;
	border: 1px solid #fff;
	border-top-color: #ddd;
	position: fixed;
  bottom: 0;
  z-index:10000000;
  background:rgba(255,255,255,1)
}
.line p{
  text-align:center;
}
</style>
