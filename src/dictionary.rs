use rand::Rng;
use rand::distributions::Distribution;

pub struct Dictionary<'dict> {
    pub word_size: usize,
    words: &'dict str,
}

impl<'dict> Dictionary<'dict> {
    pub fn new(word_size: usize, words: &'dict str) -> Self {
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
        let query = word;
        let i = self.dict_size();
        let i = i.next_power_of_two();
        let mut i = i >> 1;

        loop {
            if i.trailing_zeros() == 0 {
                break;
            }
            let pivot = match self.get_word(i) {
                Some(w) => w,
                None => return false,
            };
            let step = 1 << (i.trailing_zeros() - 1);
            match query.cmp(pivot) {
                std::cmp::Ordering::Equal => return true,
                std::cmp::Ordering::Less => i -= step,
                std::cmp::Ordering::Greater => i += step,
            }
        }

        match self.get_word(i) {
            Some(w) => {
                w == query
            },
            None => return false,
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
        &self.words[index..(index + self.word_size)]
    }

    fn dict_size(&self) -> usize {
        self.words.len() / self.word_size
    }
}
