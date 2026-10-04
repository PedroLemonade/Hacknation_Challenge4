"""ChatGPT/Codex: loss mask excludes every padding token after the real EOS.
Uses MLX primitives. Length is token count; valid token indices end at length-1.
"""
import mlx.core as mx
import mlx.nn as nn

def completion_mask(lengths, target_length):
 positions=mx.arange(1,target_length+1)
 return mx.logical_and(positions>=lengths[:,0:1],positions<lengths[:,1:])

def completion_loss(model,batch,lengths):
 logits=model(batch[:,:-1]);targets=batch[:,1:]
 mask=completion_mask(lengths,targets.shape[1]);ntoks=mask.sum()
 ce=nn.losses.cross_entropy(logits,targets)*mask
 return ce.astype(mx.float32).sum()/ntoks,ntoks
