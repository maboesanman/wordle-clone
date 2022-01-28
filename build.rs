
use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io;
use std::io::BufRead;
use std::io::BufWriter;
use std::io::Write;
use std::path::Path;

fn main() {
    let out_dir = env::var_os("OUT_DIR").unwrap();
    let file = File::open("english-words/words_alpha.txt").unwrap();
    let words = io::BufReader::new(file).lines();
    let mut words: Vec<_> = words.map(|l| l.unwrap()).collect();
    words.sort();

    let file_name = format!("dictionaries.rs");
    let file_path = Path::new(&out_dir).join(file_name);
    let mut dictionaries = File::create(file_path).unwrap();
    dictionaries.write("{let mut dictionaries = HashMap::<usize, _>::new();".as_bytes()).unwrap();
    let mut output_words = HashMap::<usize, BufWriter<_>>::new();

    for word in words {
        let word_len = word.len() as usize;
        if !output_words.contains_key(&word_len) {
            let file_name = format!("words_{word_len}.txt");
            let file_path = Path::new(&out_dir).join(&file_name);
            let file = File::create(file_path).unwrap();
            output_words.insert(word_len, BufWriter::new(file));
            let inc_new_dict = format!("dictionaries.insert({word_len}, include_str!(concat!(env!(\"OUT_DIR\"), \"/{file_name}\")));\n");
            dictionaries.write(inc_new_dict.as_bytes()).unwrap();
        }
        let file = output_words.get_mut(&word_len).unwrap();
        file.write(word.as_bytes()).unwrap();
    }

    for (_, mut words) in output_words {
        words.flush().unwrap();
    }

    dictionaries.write("dictionaries}".as_bytes()).unwrap();
    dictionaries.flush().unwrap();

    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=english-words/words_alpha.txt");
}

