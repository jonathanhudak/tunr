<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
</script>

<div class="container h-full mx-auto max-w-2xl px-2 py-6">
	<nav class="py-2">
		<a href="/" class="text-5xl">Tunr</a>
	</nav>

	<slot />
	<footer class="flex justify-between p-3">
		<span>Made with 🤘🏻 by <a href="https://hudak.codes">hudak.codes</a></span>
		<span
			>Source:&nbsp;<a href="https://github.com/jonathanhudak/tunr">github.com/jonathanhudak/tunr</a
			></span
		>
	</footer>
</div>
