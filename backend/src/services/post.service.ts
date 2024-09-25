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
}

export async function getPosts() {
    const posts = await prisma.post.findMany({
        include: {
            profile: {
                select: {
                    imagePath: true,
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
                            imagePath: true,
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
                    imagePath: true,
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
                            imagePath: true,
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

export default {
    createPost,
    updatePost,
    getPosts,
    getPost
}
