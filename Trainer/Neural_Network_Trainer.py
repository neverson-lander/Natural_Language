# use natural language toolkit
import nltk
from nltk.stem.lancaster import LancasterStemmer
from unicodedata import normalize
import string
from nltk.corpus import stopwords
import os
import json
import datetime
from mongoengine import *
from classify import *
from intent import *
from sentence import *
import sys
import numpy as np
#stemmer = LancasterStemmer()

stemmer = nltk.stem.RSLPStemmer()#deixa somente a raiz da palavra
stopwords = set(stopwords.words('portuguese'))
#Recebe o token via chamada
#token = sys.argv[1]
param = sys.stdin.readlines()
token = json.loads(param[0])

#token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFzc2lmeVRva2VuIjoiQ2xhc3NpZmljYWRvciBBdm9uIiwiaWF0IjoxNDk3ODk2MzkyfQ.iuNcuaCT7Yd4tmr3FjElpcG5TvWxx7wkJVN7zJb9PQ0'
training_data = []
words = []
classes = []
documents = []
ignore_words = ['?']
fileDir = os.path.dirname(os.path.realpath('__file__'))
# Cria os dados para treinamento
training = []
output = []

def clearSentence(sentence):
    text = removePunctuation(sentence)
    return normalize('NFKD', text).encode('ASCII','ignore').decode('ASCII')

def removePunctuation(sentence):
    return sentence.translate(sentence.maketrans('','',string.punctuation))

def getClassify():
    #conecta no banco test
    connect('test')

    #Busca os dados do classificador intents e sentences do banco
    classify = Classifies.objects(classifyToken = token).first()
    if(classify != None):
        for intent in Intents.objects(idClassify = classify._id):
            for sentence in Sentences.objects(idIntent = intent._id):
                training_data.append({"class":intent.intentName, "sentence":clearSentence(sentence.desSentence)})

    #print ("%s sentences in training data" % len(training_data))


#---------------------------------------------------------
# Abaixo são funções para limpar e organizar as sentenças e classes para treinamento

def preTrain():
    global words
    # loop em todas as sentensas de treinamento
    for pattern in training_data:
        # tokenize cada palavra
        w =  nltk.word_tokenize(pattern['sentence'])
        # Adiciona na lista de palavras já com tokenize
        words.extend(w)
        # Adiciona para lista de documentos
        documents.append((w, pattern['class']))
        # Adiciona as classes
        if pattern['class'] not in classes:
            classes.append(pattern['class'])

    # Stem cada palavra do treinamento, antes removendo as palavras consideradas stopwords
    words = [stemmer.stem(w.lower()) for w in words if w not in stopwords] 
    words = list(set(words))
    #print("stop:", words)


    #print (len(documents), "documents")
    #print (len(classes), "classes", classes)
    #print (len(words), "unique stemmed words", words)


    # Cria um array vazio para output
    output_empty = [0] * len(classes)

    # Cria um treinamento com bag de palavras
    for doc in documents:
        bag = []
        # lista com as palavras com tokenize aplicado
        pattern_words = doc[0]
        # stem cada palavra
        pattern_words = [stemmer.stem(word.lower()) for word in pattern_words]
        # Cria um bag de palavras, aplicando 1 para quando existir e 0 quando não existir
        for w in words:
            bag.append(1) if w in pattern_words else bag.append(0)

        training.append(bag)
        # output is a '0' for each tag and '1' for current tag
        output_row = list(output_empty)
        output_row[classes.index(doc[1])] = 1
        output.append(output_row)

    #print ("# words", len(words))
    #print ("# classes", len(classes))


    # imprime um exemplo do treinamento
    i = 0
    w = documents[i][0]
    #print ([stemmer.stem(word.lower()) for word in w])
    #print (training[i])
    #print (output[i])

#---------------------------------------------------
#---------------------------------------------------


import numpy as np
import time

# funão não linear, mapeia qualquer valor entre 0 e 1
def sigmoid(x):
    output = 1/(1+np.exp(-x)) #Se não for derivada, retorna esse
    return output

# convert o output da funão sigmoid em derivada
def sigmoid_output_to_derivative(output):
    return output*(1-output)




# ANN and Gradient Descent code from https://iamtrask.github.io//2015/07/27/python-network-part2/
def train(X, y, hidden_neurons=10, alpha=1, epochs=50000, dropout=False, dropout_percent=0.5):
    #print ("Training with %s neurons, alpha:%s, dropout:%s %s" % (hidden_neurons, str(alpha), dropout, dropout_percent if dropout else '') )
    #print ("Input matrix: %sx%s    Output matrix: %sx%s" % (len(X),len(X[0]),1, len(classes)) )
    np.random.seed(1)

    last_mean_error = 1
    # randomly initialize our weights with mean 0
    synapse_0 = 2*np.random.random((len(X[0]), hidden_neurons)) - 1
    synapse_1 = 2*np.random.random((hidden_neurons, len(classes))) - 1

    prev_synapse_0_weight_update = np.zeros_like(synapse_0)
    prev_synapse_1_weight_update = np.zeros_like(synapse_1)

    synapse_0_direction_count = np.zeros_like(synapse_0)
    synapse_1_direction_count = np.zeros_like(synapse_1)
        
    for j in iter(range(epochs+1)):

        # Feed forward through layers 0, 1, and 2
        layer_0 = X
        layer_1 = sigmoid(np.dot(layer_0, synapse_0))
                
        if(dropout):
            layer_1 *= np.random.binomial([np.ones((len(X),hidden_neurons))],1-dropout_percent)[0] * (1.0/(1-dropout_percent))

        layer_2 = sigmoid(np.dot(layer_1, synapse_1))

        # how much did we miss the target value?
        layer_2_error = y - layer_2

        if (j% 10000) == 0 and j > 5000:
            # if this 10k iteration's error is greater than the last iteration, break out
            if np.mean(np.abs(layer_2_error)) < last_mean_error:
                #print ("delta after "+str(j)+" iterations:" + str(np.mean(np.abs(layer_2_error))) )
                last_mean_error = np.mean(np.abs(layer_2_error))
            else:
                #print ("break:", np.mean(np.abs(layer_2_error)), ">", last_mean_error )
                break
                
        # in what direction is the target value?
        # were we really sure? if so, don't change too much.
        layer_2_delta = layer_2_error * sigmoid_output_to_derivative(layer_2)

        # how much did each l1 value contribute to the l2 error (according to the weights)?
        layer_1_error = layer_2_delta.dot(synapse_1.T)

        # in what direction is the target l1?
        # were we really sure? if so, don't change too much.
        layer_1_delta = layer_1_error * sigmoid_output_to_derivative(layer_1)
        
        synapse_1_weight_update = (layer_1.T.dot(layer_2_delta))
        synapse_0_weight_update = (layer_0.T.dot(layer_1_delta))
        
        if(j > 0):
            synapse_0_direction_count += np.abs(((synapse_0_weight_update > 0)+0) - ((prev_synapse_0_weight_update > 0) + 0))
            synapse_1_direction_count += np.abs(((synapse_1_weight_update > 0)+0) - ((prev_synapse_1_weight_update > 0) + 0))        
        
        synapse_1 += alpha * synapse_1_weight_update
        synapse_0 += alpha * synapse_0_weight_update
        
        prev_synapse_0_weight_update = synapse_0_weight_update
        prev_synapse_1_weight_update = synapse_1_weight_update

    now = datetime.datetime.now() 

    # Salva synapses
    synapse = {'synapse0': synapse_0.tolist(), 'synapse1': synapse_1.tolist(),
               'datetime': now.strftime("%Y-%m-%d %H:%M"),
               'words': words,
               'classes': classes
              }

    #synapse_file = os.path.join(fileDir, '../Model/' + token + '.json')
    synapse_file = os.path.join(fileDir, '../../../../../Empresa/Natural_Language/Model/' + token + '.json')
    
    with open(synapse_file, 'w') as outfile:
        json.dump(synapse, outfile, indent=4, sort_keys=True)
    #print ("saved synapses to:", synapse_file)
try:
    getClassify()
    if(len(training_data) > 0):
        preTrain()

        X = np.array(training)
        y = np.array(output)
        start_time = time.time()

        train(X, y, hidden_neurons=20, alpha=0.1, epochs=100000, dropout=False, dropout_percent=0.2)

        elapsed_time = time.time() - start_time
        #print ("processing time:", elapsed_time, "seconds") 

        #Salva as palavras para ser consumido pelo classificador
        #words_file = os.path.join(fileDir, '../Model/words.json')
        words_file = os.path.join(fileDir, '../../../../../Empresa/Natural_Language/Model/words.json')
        #words_file = "/Model/words.json"
        with open(words_file, 'w') as outfile:
            json.dump(words, outfile, indent=4, sort_keys=True)

        #Salva as classes para ser consumido pelo classificador
        #classes_file = os.path.join(fileDir, '../Model/classes.json')
        classes_file = os.path.join(fileDir, '../../../../../Empresa/Natural_Language/Model/classes.json')

        with open(classes_file, 'w') as outfile:
            json.dump(classes, outfile, indent=4, sort_keys=True)

        #sys.exit(1)
        print('Treino finalizado!')
    else:
        print('Não existe dados para treinamento!')
except:
        sys.exit("Ocorreu um erro durante o treinamento!")




    