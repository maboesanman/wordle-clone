
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
    let wordle_official = "dictionaries/WordleDictionary/wordle_complete_dictionary.txt";
    let scrabble_official = "dictionaries/dictionary/ospd.txt";
    let other_word_lists = [
        "dictionaries/Wordlist/res/a.txt",
        "dictionaries/Wordlist/res/b.txt",
        "dictionaries/Wordlist/res/c.txt",
        "dictionaries/Wordlist/res/d.txt",
        "dictionaries/Wordlist/res/e.txt",
        "dictionaries/english-words/words_alpha.txt"
    ];

    let mut final_dictionary: HashMap<String, usize> = HashMap::new();

    for path in other_word_lists.iter() {
        let file = File::open(path).unwrap();
        let words = io::BufReader::new(file).lines();

        for word in words {
            let word = word.unwrap().to_lowercase();
            if word.len() <= 8 { // handled by scrabble or wordle
                continue
            }
            match final_dictionary.get_mut(&word) {
                Some(count) => *count += 1,
                None => {
                    final_dictionary.insert(word, 1);
                },
            }
        }
    }

    let file = File::open(scrabble_official).unwrap();
    let words = io::BufReader::new(file).lines();
    for word in words {
        final_dictionary.insert(word.unwrap().to_lowercase(), 100);
    }

    let file = File::open(wordle_official).unwrap();
    let words = io::BufReader::new(file).lines();
    for word in words {
        final_dictionary.insert(word.unwrap().to_lowercase(), 100);
    }

    final_dictionary.retain(|_, c| c > &mut 4);
    let mut final_dictionary: Vec<_> = final_dictionary.drain().map(|(s, _)| s).collect();
    final_dictionary.sort();

    let file_name = format!("dictionaries.rs");
    let file_path = Path::new(&out_dir).join(file_name);
    let mut dictionaries = File::create(file_path).unwrap();
    dictionaries.write("{let mut dictionaries = HashMap::<usize, _>::new();".as_bytes()).unwrap();
    let mut output_words = HashMap::<usize, BufWriter<_>>::new();

    for word in final_dictionary {
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
    println!("cargo:rerun-if-changed=dictionaries/WordleDictionary/wordle_complete_dictionary.txt");
    println!("cargo:rerun-if-changed=dictionaries/Wordlist/res/a.txt");
    println!("cargo:rerun-if-changed=dictionaries/Wordlist/res/b.txt");
    println!("cargo:rerun-if-changed=dictionaries/Wordlist/res/c.txt");
    println!("cargo:rerun-if-changed=dictionaries/Wordlist/res/d.txt");
    println!("cargo:rerun-if-changed=dictionaries/Wordlist/res/e.txt");
    println!("cargo:rerun-if-changed=dictionaries/english-words/words_alpha.txt");
}

