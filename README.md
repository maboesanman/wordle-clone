# Wordle Clone

[Try it here!](https://maboesanman.github.io/wordle-clone/)

This is a simple wordle clone that I used primarily as an experimentation platform for a few new (to me) technologies:
- wasm/wasm-bindgen/wasm-pack
- react functional components
- build.rs configuration (for compiling the dictionaries)
- css modules

The dictionary is statically included into the binary, and referenced in place.

Notice that if the wasm is still loading, you are able to start entering your word, and it will simply wait until it is loaded to advance you to the next row!
