import numpy as np
import tflearn

from tflearn.datasets import titanic
titanic.download_dataset("titanic-dataset.csv")

from tflearn.data_utils import load_csv
data, labels = load_csv("titanic-dataset.csv", target_column = 0, columns_to_ignore = [2, 7], categorical_labels = True, n_classes = 2)

for p in data:
    if p[1] == "female":
        p[1] = 1
    else:
        p[1] = 0

# for x in data:
#   print(x)

net = tflearn.input_data(shape=[None, 6])
net = tflearn.fully_connected(net, 32)
net = tflearn.fully_connected(net, 32)
net = tflearn.fully_connected(net, 32)
net = tflearn.fully_connected(net, 2, activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)
model.fit(data, labels, n_epoch=50, batch_size=16, show_metric=True)

print("Rohan's odds of survival: ", model.predict([[2, 0, 16, 2, 0, 80.00]])[0][1])
print("Aryaman's odds of survival: ", model.predict([[2, 0, 14, 2, 0, 80.00]])[0][1])
print("Michiko's odds of survival: ", model.predict([[2, 1, 17, 3, 0, 80.00]])[0][1])
print("Calder's odds of survival: ", model.predict([[2, 0, 14, 3, 0, 80.00]])[0][1])
print("Amogh's odds of survival: ", model.predict([[2, 0, 16, 2, 0, 80.00]])[0][1])
print("Sirish's odds of survival: ", model.predict([[2, 0, 17, 2, 0, 80.00]])[0][1])
print("William's odds of survival: ", model.predict([[2, 0, 16, 3, 0, 80.00]])[0][1])
print("Luke's odds of survival: ", model.predict([[2, 0, 14, 3, 0, 80.00]])[0][1])
print("Adam's odds of survival: ", model.predict([[2, 0, 15, 2, 0, 80.00]])[0][1])