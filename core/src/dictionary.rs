use rand::Rng;
use rand::distributions::Distribution;

pub struct Dictionary<'dict> {
    pub word_size: usize,
    words: &'dict [u8],
}

impl<'dict> Dictionary<'dict> {
    pub fn new(word_size: usize, words: &'dict [u8]) -> Self {
        Self {
            word_size,
            words,
        }
    }

    pub fn random_word<R>(&self, rng: &mut R) -> &'dict str 
        where R: Rng
    {
        let i = rand::distributions::Uniform::new(0, self.dict_size()).sample(rng);
        unsafe { self.get_word_unchecked(i) }
    }

    pub fn validate_word(&self, word: &str) -> bool {
        let mut start = 0;
        let mut end = self.dict_size();
        loop {
            if start == end - 1 {
                let start_str = unsafe { self.get_word_unchecked(start) };
                break start_str == word;
            }

            let pivot = (start + end) / 2;
            let pivot_str = unsafe { self.get_word_unchecked(pivot) };
            match word.cmp(pivot_str) {
                std::cmp::Ordering::Equal => return true,
                std::cmp::Ordering::Less => end = pivot,
                std::cmp::Ordering::Greater => start = pivot,
            }
        }
    }



    pub fn get_word(&self, index: usize) -> Option<&'dict str> {
        if index >= self.dict_size() {
            return None
        }
        Some(unsafe { self.get_word_unchecked(index) })
    }

    unsafe fn get_word_unchecked(&self, index: usize) -> &'dict str {
        let index = index * self.word_size;

        // build.rs ensures all words are ascii
        std::str::from_utf8_unchecked(&self.words.get_unchecked(index..(index + self.word_size)))
    }

    fn dict_size(&self) -> usize {
        self.words.len() / self.word_size
    }
}
