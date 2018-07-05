import gym
env = gym.make("FrozenLake-v0")
env.reset()

score = 0
for _ in range(10000):
    env.reset()
    for _ in range(100):
        obs, rew, done, info = env.step(1)
        #obs, rew, done, info = env.step(2)
        if done:
            if rew != 0:
                score += 1
            break
print(str(score / 100) + "%")
