import nltk
import re
import sys
#nltk.download('punkt')
#nltk.download('stopwords')

phrase = sys.argv[1]

sentences = nltk.sent_tokenize(phrase)


formatted_article_text = re.sub(r'^\w ', ' ', phrase)
formatted_article_text = re.sub(r'\s+', ' ', formatted_article_text)

#print(formatted_article_text)

stopwords = nltk.corpus.stopwords.words('english')

word_frequencies = {}
for word in nltk.word_tokenize(formatted_article_text):
    if word not in stopwords:
        if word not in word_frequencies.keys():
            word_frequencies[word] = 1
        else:
            word_frequencies[word] += 1

frequency = max(word_frequencies.values())

for word in word_frequencies.keys():
    word_frequencies[word] = (word_frequencies[word]/frequency)

sentence_scores = {}
for sent in sentences:
    for word in nltk.word_tokenize(sent.lower()):
        if word in word_frequencies.keys():
            if len(sent.split(' ')) < 40:
                if sent not in sentence_scores.keys():
                    sentence_scores[sent] = word_frequencies[word]
                else:
                    sentence_scores[sent] += word_frequencies[word]

import heapq
x = 5
summary_sentences = heapq.nlargest(x, sentence_scores, key=sentence_scores.get)
summary_sentences = list(summary_sentences)


summary = ' '.join(summary_sentences)
f = open("summary.txt",'w')
for elem in summary_sentences:
    f.write(elem)
    f.write("\n")
f.close()
print("gb")
sys.stdout.flush()