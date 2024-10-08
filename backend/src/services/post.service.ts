import { Conflict, NotFound } from "../utils/error.util";
import logger from "../utils/logger.util";
import prisma from "../utils/prisma.util";
import { AccountWithProfile } from "../utils/types.util";

export async function createPost(currentAccount: AccountWithProfile, title: string, content: string) {
    const post = await prisma.post.create({
        data: {
            profileId: currentAccount.profile.id,
            title,
            content
        }
    }).catch(() => {
        throw new Conflict("It is not possible to create this post");
    })

    logger.info(`${currentAccount.username} created post ${post.id}`, currentAccount)

    return post;
}

export async function updatePost(currentAccount: AccountWithProfile, id: string, title: string, content: string) {
    let post = await prisma.post.findUnique({ where: { id } });
    if(!post) throw new NotFound({ id: "Post not found" });

    post = await prisma.post.update({
        where: {
            id
        },
        data: {
            title,
            content
        }
    }).catch(() => {
        throw new Conflict("It is not possible to update this post");
    })

    logger.info(`${currentAccount.username} updated post ${post.id}`, currentAccount)

    return post;
}

export async function getPosts() {
    const posts = await prisma.post.findMany({
        orderBy: [ { createdAt: 'desc' }],
        include: {
            profile: {
                select: {
                    account: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            likes: {
                select: {
                    profile: {
                        select: {
                            account: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            },
            comments: {
                select: {
                    profile: {
                        select: {
                            account: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    })

    return posts
}

export async function getHomePosts() {
    const posts = await prisma.post.findMany({
        orderBy: [ { createdAt: 'desc' }],
        where: {
            homePage: true
        },
        include: {
            profile: {
                select: {
                    account: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            likes: {
                select: {
                    profile: {
                        select: {
                            account: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            },
            comments: {
                select: {
                    profile: {
                        select: {
                            account: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    })

    return posts
}

export async function getPost(id: string) {
    const post = await prisma.post.findUnique({
        where: {
            id
        },
        include: {
            profile: {
                select: {
                    account: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            likes: {
                select: {
                    profile: {
                        select: {
                            account: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            },
            comments: {
                select: {
                    profile: {
                        select: {
                            account: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    })

    if(!post) throw new NotFound({ id: "Post not found" })

    return post
}

export async function like(currentAccount: AccountWithProfile, id: string) {
    const post = await prisma.post.findUnique({ where: { id } })
    if(!post) throw new NotFound({ id: "Post not found" })
    
    await prisma.postLike.create({
        data: {
            profileId: currentAccount.profile.id,
            postId: post.id
        }
    }).catch(() => {});
}

export async function unlike(currentAccount: AccountWithProfile, id: string) {
    const post = await prisma.post.findUnique({ where: { id } })
    if(!post) throw new NotFound({ id: "Post not found" })
    
    await prisma.postLike.deleteMany({
        where: {
            profileId: currentAccount.profile.id,
            postId: post.id
        }
    })
}

export async function changeHomePagePost(currentAccount: AccountWithProfile, id: string, homePage: boolean) {
    let post = await prisma.post.findUnique({ where: { id } });
    if(!post) throw new NotFound({ id: "Post not found" });

    post = await prisma.post.update({
        where: {
            id
        },
        data: {
            homePage
        }
    }).catch(() => {
        throw new Conflict("It is not possible to update this post");
    })

    logger.info(`${currentAccount.username} changed post ${post.id} visibility`, currentAccount)

    return post;
}

export default {
    createPost,
    updatePost,
    getPosts,
    getPost,
    like,
    unlike,
    getHomePosts,
    changeHomePagePost
}
