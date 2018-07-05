import gym
env = gym.make("FrozenLake-v0")
#env.reset()
#env.render()
env.reset()
for _ in range(100):
    obs, rew, done, info = env.step(env.action_space.sample())
    env.render()
    if done:
        print("you lost")
        break
    if rew == 1:
        print("Winner!")